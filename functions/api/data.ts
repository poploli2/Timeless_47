/// <reference types="@cloudflare/workers-types" />
import type { Env, ApiResponse } from '../types';

// D1 数据库查询 API

// 查询数据
// GET /api/data?table=memories&limit=10
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const url = new URL(request.url);
        const table = url.searchParams.get('table');
        const limit = parseInt(url.searchParams.get('limit') || '50');

        if (!table) {
            return Response.json({
                success: false,
                error: '缺少 table 参数'
            } as ApiResponse, { status: 400 });
        }

        // 简单的表名白名单验证
        const allowedTables = ['users', 'memories', 'milestones'];
        if (!allowedTables.includes(table)) {
            return Response.json({
                success: false,
                error: '无效的表名'
            } as ApiResponse, { status: 400 });
        }

        const { results } = await env.DB.prepare(
            `SELECT * FROM ${table} ORDER BY created_at DESC LIMIT ?`
        ).bind(limit).all();

        return Response.json({
            success: true,
            data: results
        } as ApiResponse);

    } catch (error) {
        console.error('查询错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '查询失败'
        } as ApiResponse, { status: 500 });
    }
};

// 插入数据
// POST /api/data
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            table: string;
            data: Record<string, any>;
        };

        if (!body.table || !body.data) {
            return Response.json({
                success: false,
                error: '缺少 table 或 data 参数'
            } as ApiResponse, { status: 400 });
        }

        // 表名白名单验证
        const allowedTables = ['users', 'memories', 'milestones'];
        if (!allowedTables.includes(body.table)) {
            return Response.json({
                success: false,
                error: '无效的表名'
            } as ApiResponse, { status: 400 });
        }

        // 构建插入语句
        const fields = Object.keys(body.data);
        const values = Object.values(body.data);
        const placeholders = fields.map(() => '?').join(', ');

        const result = await env.DB.prepare(
            `INSERT INTO ${body.table} (${fields.join(', ')}) VALUES (${placeholders})`
        ).bind(...values).run();

        return Response.json({
            success: true,
            data: {
                id: result.meta.last_row_id,
                changes: result.meta.changes
            }
        } as ApiResponse);

    } catch (error) {
        console.error('插入错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '插入失败'
        } as ApiResponse, { status: 500 });
    }
};

// 更新数据
// PUT /api/data
export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            table: string;
            id: string | number;
            data: Record<string, any>;
        };

        if (!body.table || !body.id || !body.data) {
            return Response.json({
                success: false,
                error: '缺少必要参数'
            } as ApiResponse, { status: 400 });
        }

        // 表名白名单验证
        const allowedTables = ['users', 'memories', 'milestones'];
        if (!allowedTables.includes(body.table)) {
            return Response.json({
                success: false,
                error: '无效的表名'
            } as ApiResponse, { status: 400 });
        }

        // 构建更新语句
        const fields = Object.keys(body.data);
        const values = Object.values(body.data);
        const setClause = fields.map(f => `${f} = ?`).join(', ');

        const result = await env.DB.prepare(
            `UPDATE ${body.table} SET ${setClause} WHERE id = ?`
        ).bind(...values, body.id).run();

        return Response.json({
            success: true,
            data: { changes: result.meta.changes }
        } as ApiResponse);

    } catch (error) {
        console.error('更新错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '更新失败'
        } as ApiResponse, { status: 500 });
    }
};
