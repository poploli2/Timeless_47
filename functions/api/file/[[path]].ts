/// <reference types="@cloudflare/workers-types" />
import type { Env } from '../../types';

// 获取文件 - 通配符路由
// GET /api/file/*
export const onRequest: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const url = new URL(request.url);

        // 从路径中提取文件key
        // /api/file/uploads/xxx.png -> uploads/xxx.png
        const pathParts = url.pathname.split('/api/file/');
        const key = pathParts[1];

        if (!key) {
            return new Response('缺少文件 key', { status: 400 });
        }

        const object = await env.BUCKET.get(key);

        if (!object) {
            return new Response('文件不存在', { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);
        headers.set('Cache-Control', 'public, max-age=31536000'); // 缓存1年

        return new Response(object.body, { headers });

    } catch (error) {
        console.error('获取文件错误:', error);
        return new Response('获取文件失败', { status: 500 });
    }
};
