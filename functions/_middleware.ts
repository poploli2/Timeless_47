/// <reference types="@cloudflare/workers-types" />
import { verifyToken } from './utils/jwt';

// Cloudflare Pages Functions 全局中间件
// 处理 CORS 和认证检查

export const onRequest: PagesFunction = async (context) => {
    const { request, env, next } = context;

    // CORS 预检请求处理
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Max-Age': '86400',
            }
        });
    }

    // 检查是否需要认证
    const authRequired = (env as any).AUTHENTICATION_REQUIRED === 'true';
    const url = new URL(request.url);

    // 如果启用认证且不是认证接口本身，则验证 JWT
    if (authRequired && !url.pathname.startsWith('/api/auth')) {
        const authHeader = request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({
                success: false,
                error: '需要登录才能访问',
                authRequired: true
            }, {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }

        // 验证 JWT token
        const token = authHeader.substring(7);
        const payload = await verifyToken(token, (env as any).JWT_SECRET);

        if (!payload) {
            return Response.json({
                success: false,
                error: '无效或过期的认证令牌',
                authRequired: true
            }, {
                status: 401,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
        }
    }

    // 继续处理请求
    const response = await next();

    // 为所有响应添加 CORS 头
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', '*');
    newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return newResponse;
};
