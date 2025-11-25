// 数据服务 - 回忆和里程碑
import { get, post, put } from './apiClient';
import { Memory, Milestone } from '../types';

/**
 * 获取所有回忆
 */
export async function getMemories() {
    return await get<Memory[]>('/memories');
}

/**
 * 创建回忆
 */
export async function createMemory(memory: Omit<Memory, 'id'>) {
    return await post<{ id: number }>('/memories', memory);
}

/**
 * 更新回忆
 */
export async function updateMemory(id: string, memory: Partial<Memory>) {
    return await put<{ changes: number }>('/memories', { id, ...memory });
}

/**
 * 删除回忆（使用DELETE方法或POST）
 */
export async function deleteMemory(id: string) {
    // 目前后端没有DELETE接口，使用POST模拟
    return await post<{ changes: number }>('/memories', { id, delete: true });
}

/**
 * 获取所有里程碑
 */
export async function getMilestones() {
    return await get<Milestone[]>('/milestones');
}

/**
 * 创建里程碑
 */
export async function createMilestone(milestone: Omit<Milestone, 'id'>) {
    return await post<{ id: number }>('/milestones', milestone);
}

/**
 * 更新里程碑
 */
export async function updateMilestone(id: string, milestone: Partial<Milestone>) {
    return await put<{ changes: number }>('/milestones', { id, ...milestone });
}

/**
 * 删除里程碑
 */
export async function deleteMilestone(id: string) {
    return await post<{ changes: number }>('/milestones', { id, delete: true });
}
