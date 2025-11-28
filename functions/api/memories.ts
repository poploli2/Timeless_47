/// <reference types="@cloudflare/workers-types" />
import type { Env, ApiResponse } from '../types';

function mapMemoryFields(dbRecord: any) {
    return {
        id: dbRecord.id,
        title: dbRecord.title,
        content: dbRecord.content,
        date: dbRecord.date,
        location: dbRecord.location,
        mood: dbRecord.mood,
        imageUrl: dbRecord.image_url,
        createdAt: dbRecord.created_at,
        updatedAt: dbRecord.updated_at
    };
}


// GET /api/memories
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const { env } = context;

        const { results } = await env.DB.prepare(
            'SELECT * FROM memories ORDER BY date DESC, created_at DESC'
        ).all();

        // 转换字段命名
        const mappedResults = results.map(mapMemoryFields);

        return Response.json({
            success: true,
            data: mappedResults
        } as ApiResponse);

    } catch (error) {
        console.error('查询回忆错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '查询失败'
        } as ApiResponse, { status: 500 });
    }
};

// POST /api/memories
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            title?: string;
            content?: string;
            date?: string;
            location?: string;
            mood?: string;
            imageUrl?: string;
            id?: string | number;
            delete?: boolean;
        };

        // 删除操作
        if (body.delete && body.id) {
            const result = await env.DB.prepare(
                'DELETE FROM memories WHERE id = ?'
            ).bind(body.id).run();

            return Response.json({
                success: true,
                data: { changes: result.meta.changes }
            } as ApiResponse);
        }

        // 创建操作
        if (!body.title || !body.content || !body.date) {
            return Response.json({
                success: false,
                error: '缺少必要字段'
            } as ApiResponse, { status: 400 });
        }

        const result = await env.DB.prepare(
            `INSERT INTO memories (title, content, date, location, mood, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(
            body.title,
            body.content,
            body.date,
            body.location || null,
            body.mood || null,
            body.imageUrl || null
        ).run();

        return Response.json({
            success: true,
            data: { id: result.meta.last_row_id }
        } as ApiResponse);

    } catch (error) {
        console.error('创建/删除回忆错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '操作失败'
        } as ApiResponse, { status: 500 });
    }
};

// PUT /api/memories
export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const { request, env } = context;
        const body = await request.json() as {
            id: string | number;
            title?: string;
            content?: string;
            date?: string;
            location?: string;
            mood?: string;
            imageUrl?: string;
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
        if (body.content) { fields.push('content = ?'); values.push(body.content); }
        if (body.date) { fields.push('date = ?'); values.push(body.date); }
        if (body.location !== undefined) { fields.push('location = ?'); values.push(body.location); }
        if (body.mood !== undefined) { fields.push('mood = ?'); values.push(body.mood); }
        if (body.imageUrl !== undefined) { fields.push('image_url = ?'); values.push(body.imageUrl); }

        if (fields.length === 0) {
            return Response.json({
                success: false,
                error: '没有要更新的字段'
            } as ApiResponse, { status: 400 });
        }

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(body.id);

        const result = await env.DB.prepare(
            `UPDATE memories SET ${fields.join(', ')} WHERE id = ?`
        ).bind(...values).run();

        return Response.json({
            success: true,
            data: { changes: result.meta.changes }
        } as ApiResponse);

    } catch (error) {
        console.error('更新回忆错误:', error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : '更新失败'
        } as ApiResponse, { status: 500 });
    }
};
