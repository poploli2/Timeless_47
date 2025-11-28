import { post } from './apiClient';

interface LoginResponse {
    user: {
        id: number;
        username: string;
        role: string;
    };
    token: string;
}

// 全局认证事件系统
type AuthRequiredListener = () => void;
const authRequiredListeners: AuthRequiredListener[] = [];

/**
 * 注册认证失败监听器
 */
export function onAuthRequired(callback: AuthRequiredListener) {
    authRequiredListeners.push(callback);
    return () => {
        const index = authRequiredListeners.indexOf(callback);
        if (index > -1) authRequiredListeners.splice(index, 1);
    };
}

/**
 * 触发认证失败事件（由 apiClient 调用）
 */
export function emitAuthRequired() {
    authRequiredListeners.forEach(listener => listener());
}

export async function login(username: string, password: string) {
    const result = await post<LoginResponse>('/auth', { username, password });

    if (result.success && result.data) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result;
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
    return !!getToken();
}
