// 密码加密工具（使用 Web Crypto API）

/**
 * 对密码进行 SHA-256 哈希
 * @param password 原始密码
 * @returns 十六进制哈希字符串
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 验证密码
 * @param password 用户输入的密码
 * @param hashedPassword 数据库中存储的哈希密码
 * @returns 是否匹配
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const inputHash = await hashPassword(password);
    return inputHash === hashedPassword;
}
