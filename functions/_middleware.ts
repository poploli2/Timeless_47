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
    const strictAuthMode = (env as any).AUTHENTICATION_REQUIRED === 'true';
    const url = new URL(request.url);

    // 双模式认证策略：
    // 【严格模式】当 AUTHENTICATION_REQUIRED = true 时：
    //   - 所有 API 端点都需要认证（包括 GET、文件访问、AI）
    //   - 仅排除 /api/auth 登录接口
    //
    // 【宽松模式】当 AUTHENTICATION_REQUIRED = false 时：
    //   - GET 请求开放（查询开放）
    //   - 关键操作（POST/PUT/DELETE - 增删改、AI）需要认证
    //   - /api/auth 始终开放

    const isApiRequest = url.pathname.startsWith('/api/');
    const isAuthEndpoint = url.pathname.startsWith('/api/auth');
    const isGetRequest = request.method === 'GET';

    // 判断是否需要验证 token
    const needsAuth = isApiRequest && !isAuthEndpoint && (
        strictAuthMode || !isGetRequest  // 严格模式：所有请求；宽松模式：仅非 GET 请求
    );

    if (needsAuth) {
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
