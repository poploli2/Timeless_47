/// <reference types="@cloudflare/workers-types" />
import type { Env, ApiResponse } from '../types';

// POST /api/ai
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            prompt: string;
            context?: string;
        };

        if (!body.prompt) {
            return Response.json({
                success: false,
                error: '缺少 prompt 参数'
            } as ApiResponse, { status: 400 });
        }

        // 调用 OpenAI API
        const response = await fetch(`${env.OPENAI_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: env.OPENAI_MODEL || 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: body.context || '你是一个浪漫助手，帮助情侣创造美好回忆。'
                    },
                    {
                        role: 'user',
                        content: body.prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenAI API 错误:', error);
            return Response.json({
                success: false,
                error: 'AI 服务请求失败'
            } as ApiResponse, { status: 500 });
        }

        const data = await response.json() as any;
        const content = data.choices?.[0]?.message?.content;

        return Response.json({
            success: true,
            data: { content }
        } as ApiResponse);

    } catch (error) {
        console.error('AI API 错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '未知错误'
        } as ApiResponse, { status: 500 });
    }
};
