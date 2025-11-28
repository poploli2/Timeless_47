/// <reference types="@cloudflare/workers-types" />
import type { Env, ApiResponse } from '../types';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { generateToken, verifyToken } from '../utils/jwt';

// 用户认证 API
// POST /api/auth - 登录
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            username: string;
            password: string;
        };

        if (!body.username || !body.password) {
            return Response.json({
                success: false,
                error: '缺少用户名或密码'
            } as ApiResponse, { status: 400 });
        }

        const user = await env.DB.prepare(
            'SELECT * FROM users WHERE username = ?'
        ).bind(body.username).first() as any;

        if (!user) {
            return Response.json({
                success: false,
                error: '用户名或密码错误'
            } as ApiResponse, { status: 401 });
        }

        const isValid = await verifyPassword(body.password, user.password);
        if (!isValid) {
            return Response.json({
                success: false,
                error: '用户名或密码错误'
            } as ApiResponse, { status: 401 });
        }

        // 生成 JWT token
        const token = await generateToken(
            { username: user.username, userId: user.id },
            env.JWT_SECRET
        );

        const { password: _, ...userWithoutPassword } = user;

        return Response.json({
            success: true,
            data: {
                user: userWithoutPassword,
                token
            }
        } as ApiResponse);

    } catch (error) {
        console.error('登录错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '登录失败'
        } as ApiResponse, { status: 500 });
    }
};

// GET /api/auth - 验证 token
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({
                success: false,
                error: '未提供认证令牌'
            } as ApiResponse, { status: 401 });
        }

        const token = authHeader.substring(7);
        const payload = await verifyToken(token, env.JWT_SECRET);

        if (!payload) {
            return Response.json({
                success: false,
                error: '无效的令牌'
            } as ApiResponse, { status: 401 });
        }

        return Response.json({
            success: true,
            data: { username: payload.username, userId: payload.userId, valid: true }
        } as ApiResponse);

    } catch (error) {
        console.error('验证错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '验证失败'
        } as ApiResponse, { status: 500 });
    }
};
