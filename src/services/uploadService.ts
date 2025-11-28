// 图片上传服务
import { ApiResponse } from './apiClient';
import { getToken } from './authService';

/**
 * 上传图片到 R2
 * @param file 图片文件
 * @returns 上传后的图片 URL
 */
export async function uploadImage(file: File): Promise<string | null> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const token = getToken();
        const headers: HeadersInit = {};

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers,
        });

        const result: ApiResponse<{ url: string }> = await response.json();

        if (result.success && result.data?.url) {
            return result.data.url;
        } else {
            console.error('上传失败:', result.error);
            return null;
        }
    } catch (error) {
        console.error('上传图片错误:', error);
        return null;
    }
}

/**
 * 压缩图片（可选，减少上传大小）
 */
export async function compressImage(file: File, maxWidth: number = 1200): Promise<File> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                        } else {
                            resolve(file);
                        }
                    },
                    'image/jpeg',
                    0.85
                );
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    });
}
