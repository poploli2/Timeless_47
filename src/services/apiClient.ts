// API 客户端工具 - 统一管理所有 API 请求

const API_BASE = '/api';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    authRequired?: boolean;
}

/**
 * 获取认证 token
 */
function getToken(): string | null {
    return localStorage.getItem('auth_token');
}

/**
 * 统一 API 请求方法
 */
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
        });

        const data: ApiResponse<T> = await response.json();

        // 如果需要认证但未登录，跳转登录页
        if (data.authRequired && !token) {
            // 可以在这里触发登录弹窗或跳转
            console.warn('需要登录');
        }

        return data;
    } catch (error) {
        console.error('API 请求失败:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : '网络错误'
        };
    }
}

/**
 * GET 请求
 */
export async function get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'GET' });
}

/**
 * POST 请求
 */
export async function post<T>(
    endpoint: string,
    body?: any
): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * PUT 请求
 */
export async function put<T>(
    endpoint: string,
    body?: any
): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
    });
}

/**
 * DELETE 请求
 */
export async function del<T>(endpoint: string): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { method: 'DELETE' });
}
