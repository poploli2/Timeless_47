// AI 服务 - 使用后端 API
import { post } from './apiClient';
import { DateIdeaParams, LoveLetterParams } from "../types";

/**
 * 优化回忆内容
 */
export const polishMemoryContent = async (rawText: string, mood: string): Promise<string> => {
    const prompt = `你是一个浪漫的编辑。重写下面的日记条目，使其更具感染力、温暖和清晰，符合心情：${mood}。保持原意但改善流畅度。\n\n原文： "${rawText}"`;

    const result = await post<{ content: string }>('/ai', {
        prompt,
        context: '你是一个浪漫的编辑助手'
    });

    return result.success && result.data?.content ? result.data.content : rawText;
};

/**
 * 生成约会点子
 */
export const generateDateIdeas = async (params: DateIdeaParams): Promise<string> => {
    const prompt = `为情侣建议3个富有创意和浪漫的约会点子。 
限制条件：
- 天气： ${params.weather}
- 预算： ${params.budget}
- 氛围： ${params.vibe}

请以清晰的列表格式输出，并带有表情符号。`;

    const result = await post<{ content: string }>('/ai', { prompt });

    return result.success && result.data?.content ? result.data.content : "暂时无法生成点子。";
};

/**
 * 生成情书
 */
export const generateLoveLetter = async (params: LoveLetterParams, partnerName: string): Promise<string> => {
    const prompt = `给我的伴侣 ${partnerName} 写一封 ${params.length} 的情书。
场合/背景： ${params.context}。
语气： ${params.tone}。
要真诚和个性化。`;

    const result = await post<{ content: string }>('/ai', { prompt });

    return result.success && result.data?.content ? result.data.content : "无法生成情书。";
};

/**
 * 生成关系问题
 */
export const generateRelationshipQuestion = async (): Promise<string> => {
    const prompt = `生成一个有趣且引人深思的问题，供情侣回答关于他们的关系或彼此的问题。保持简短和吸引人。`;

    const result = await post<{ content: string }>('/ai', { prompt });

    return result.success && result.data?.content ? result.data.content.trim() : "你最喜欢我们哪一段回忆？";
};
