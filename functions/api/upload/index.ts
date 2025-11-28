/// <reference types="@cloudflare/workers-types" />
import type { Env, ApiResponse } from '../../types';

// R2 文件上传 API  
// POST /api/upload
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return Response.json({
                success: false,
                error: '缺少文件'
            } as ApiResponse, { status: 400 });
        }

        // 生成唯一文件名
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(7);
        const fileExtension = file.name.split('.').pop();
        const key = `uploads/${timestamp}-${randomStr}.${fileExtension}`;

        // 上传到 R2
        await env.BUCKET.put(key, file.stream(), {
            httpMetadata: {
                contentType: file.type
            }
        });

        return Response.json({
            success: true,
            data: {
                key,
                url: `/api/file/${key}` // 使用 /api/file 路径
            }
        } as ApiResponse);

    } catch (error) {
        console.error('上传错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '上传失败'
        } as ApiResponse, { status: 500 });
    }
};
