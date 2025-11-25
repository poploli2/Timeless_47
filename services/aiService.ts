import OpenAI from 'openai';
import { DateIdeaParams, LoveLetterParams } from "../types";

// Initialize the client
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const baseURL = import.meta.env.VITE_OPENAI_BASE_URL;
const modelId = import.meta.env.VITE_OPENAI_MODEL_ID || 'deepseek-chat';

const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: baseURL,
    dangerouslyAllowBrowser: true // Required for client-side usage if not using a backend proxy
});

/**
 * Polishes a memory entry to sound more poetic or correct grammar.
 */
export const polishMemoryContent = async (rawText: string, mood: string): Promise<string> => {
    if (!apiKey) return rawText;

    try {
        const prompt = `你是一个浪漫的编辑。重写下面的日记条目，使其更具感染力、温暖和清晰，符合心情：${mood}。保持原意但改善流畅度。
    
    原文： "${rawText}"`;

        const response = await openai.chat.completions.create({
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
        });

        return response.choices[0]?.message?.content || rawText;
    } catch (error) {
        console.error("Error polishing memory:", error);
        return rawText;
    }
};

/**
 * Generates creative date ideas based on parameters.
 */
export const generateDateIdeas = async (params: DateIdeaParams): Promise<string> => {
    if (!apiKey) return "请配置您的 API 密钥以使用此功能。";

    try {
        const prompt = `为情侣建议3个富有创意和浪漫的约会点子。 
    限制条件：
    - 天气： ${params.weather}
    - 预算： ${params.budget}
    - 氛围： ${params.vibe}
    
    请以清晰的列表格式输出，并带有表情符号。`;

        const response = await openai.chat.completions.create({
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
        });

        return response.choices[0]?.message?.content || "暂时无法生成点子。";
    } catch (error) {
        console.error("Error generating date ideas:", error);
        return "连接 AI 服务出错。";
    }
};

/**
 * Generates a love letter.
 */
export const generateLoveLetter = async (params: LoveLetterParams, partnerName: string): Promise<string> => {
    if (!apiKey) return "请配置您的 API 密钥以使用此功能。";

    try {
        const prompt = `给我的伴侣 ${partnerName} 写一封 ${params.length} 的情书。
    场合/背景： ${params.context}。
    语气： ${params.tone}。
    要真诚和个性化。`;

        const response = await openai.chat.completions.create({
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
        });

        return response.choices[0]?.message?.content || "无法生成情书。";
    } catch (error) {
        console.error("Error generating letter:", error);
        return "连接 AI 服务出错。";
    }
};

/**
 * Generates a relationship question for the quiz.
 */
export const generateRelationshipQuestion = async (): Promise<string> => {
    if (!apiKey) return "你最喜欢我们哪一段回忆？";

    try {
        const prompt = `生成一个有趣且引人深思的问题，供情侣回答关于他们的关系或彼此的问题。保持简短和吸引人。`;

        const response = await openai.chat.completions.create({
            model: modelId,
            messages: [{ role: 'user', content: prompt }],
        });

        return response.choices[0]?.message?.content?.trim() || "你最喜欢我们哪一段回忆？";
    } catch (error) {
        console.error("Error generating question:", error);
        return "你最喜欢我们哪一段回忆？";
    }
};
