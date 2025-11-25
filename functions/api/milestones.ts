/// <reference types="@cloudflare/workers-types" />
import type { Env, ApiResponse } from '../types';

// GET /api/milestones
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const { env } = context;

        const { results } = await env.DB.prepare(
            'SELECT * FROM milestones ORDER BY date ASC, created_at DESC'
        ).all();

        return Response.json({
            success: true,
            data: results
        } as ApiResponse);

    } catch (error) {
        console.error('查询里程碑错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '查询失败'
        } as ApiResponse, { status: 500 });
    }
};

// POST /api/milestones
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            title: string;
            date: string;
            type: string;
            description?: string;
            delete?: boolean;
            id?: string | number;
        };

        // 删除操作
        if (body.delete && body.id) {
            const result = await env.DB.prepare(
                'DELETE FROM milestones WHERE id = ?'
            ).bind(body.id).run();

            return Response.json({
                success: true,
                data: { changes: result.meta.changes }
            } as ApiResponse);
        }

        // 创建操作
        if (!body.title || !body.date || !body.type) {
            return Response.json({
                success: false,
                error: '缺少必要字段'
            } as ApiResponse, { status: 400 });
        }

        const result = await env.DB.prepare(
            `INSERT INTO milestones (title, date, type, description) 
       VALUES (?, ?, ?, ?)`
        ).bind(
            body.title,
            body.date,
            body.type,
            body.description || null
        ).run();

        return Response.json({
            success: true,
            data: { id: result.meta.last_row_id }
        } as ApiResponse);

    } catch (error) {
        console.error('创建/删除里程碑错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '操作失败'
        } as ApiResponse, { status: 500 });
    }
};

// PUT /api/milestones
export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            id: string | number;
            title?: string;
            date?: string;
            type?: string;
            description?: string;
        };

        if (!body.id) {
            return Response.json({
                success: false,
                error: '缺少 id'
            } as ApiResponse, { status: 400 });
        }

        // 构建更新字段
        const fields: string[] = [];
        const values: any[] = [];

        if (body.title) { fields.push('title = ?'); values.push(body.title); }
        if (body.date) { fields.push('date = ?'); values.push(body.date); }
        if (body.type) { fields.push('type = ?'); values.push(body.type); }
        if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description); }

        if (fields.length === 0) {
            return Response.json({
                success: false,
                error: '没有要更新的字段'
            } as ApiResponse, { status: 400 });
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(body.id);

        const result = await env.DB.prepare(
            `UPDATE milestones SET ${fields.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        return Response.json({
            success: true,
            data: { changes: result.meta.changes }
        } as ApiResponse);

    } catch (error) {
        console.error('更新里程碑错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '更新失败'
        } as ApiResponse, { status: 500 });
    }
};
