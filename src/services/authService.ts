// 认证服务
import { post, get } from './apiClient';

export interface User {
    id: number;
    username: string;
    real_name: string;
    birthday?: string;
    description?: string;
    avatar_url?: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

/**
 * 登录
 */
export async function login(username: string, password: string) {
    const result = await post<LoginResponse>('/auth', { username, password });

    if (result.success && result.data) {
        localStorage.setItem('auth_token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
}

/**
 * 验证 token
 */
export async function verifyToken() {
    return await get<{ username: string; userId: number; valid: boolean }>('/auth');
}

/**
 * 登出
 */
export function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
}

/**
 * 获取当前用户
 */
export function getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * 是否已登录
 */
export function isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
}
