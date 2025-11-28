// JWT 工具函数（使用 jose 库）

import { SignJWT, jwtVerify } from 'jose';

const JWT_EXPIRATION = '7d'; // Token 有效期 7 天

/**
 * 生成 JWT token
 * @param payload Token 载荷（用户信息）
 * @param secret JWT 密钥
 * @returns JWT token 字符串
 */
export async function generateToken(
    payload: { username: string; userId: number },
    secret: string
): Promise<string> {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(secret);

    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRATION)
        .sign(secretKey);
}

/**
 * 验证 JWT token
 * @param token JWT token 字符串
 * @param secret JWT 密钥
 * @returns Token 载荷或 null（无效时）
 */
export async function verifyToken(
    token: string,
    secret: string
): Promise<{ username: string; userId: number } | null> {
    try {
        const encoder = new TextEncoder();
        const secretKey = encoder.encode(secret);

        const { payload } = await jwtVerify(token, secretKey);
        return payload as { username: string; userId: number };
    } catch (error) {
        console.error('JWT 验证失败:', error);
        return null;
    }
}
