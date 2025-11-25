/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Functions 类型定义

export interface Env {
    // D1 数据库绑定
    DB: D1Database;

    // R2 存储桶绑定
    BUCKET: R2Bucket;

    // 环境变量
    OPENAI_API_KEY: string;
    OPENAI_BASE_URL: string;
    OPENAI_MODEL: string;

    // 认证相关
    AUTHENTICATION_REQUIRED?: string; // "true" 或 "false"
    JWT_SECRET: string; // JWT 签名密钥
}

// API 响应通用类型
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}
