import React, { useState } from 'react';
import { Milestone } from '../types';
import { Plus, Trash2 } from 'lucide-react';
import { createMilestone, deleteMilestone } from '../services/dataService';

interface MilestoneManagerProps {
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
}

export const MilestoneManager: React.FC<MilestoneManagerProps> = ({ milestones, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Anniversary');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!title || !date) return;

    setSaving(true);
    const result = await createMilestone({ title, date, type });

    if (result.success) {
      onUpdate([...milestones]);
      setTitle('');
      setDate('');
      setType('Anniversary');
      setIsAdding(false);
    } else {
      alert('保存失败: ' + result.error);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个里程碑吗？')) return;

    const result = await deleteMilestone(id);

    if (result.success) {
      onUpdate(milestones.filter(m => m.id !== id));
    } else {
      alert('删除失败: ' + result.error);
    }
  };

  return (
    <div className="mt-8 w-full max-w-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-love-700">里程碑</h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-love-600 hover:text-love-700 p-1"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-love-100 mb-3 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full rounded-lg border-gray-200 text-sm p-2"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border-gray-200 text-sm p-2"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border-gray-200 text-sm p-2"
          >
            <option value="Anniversary">纪念日</option>
            <option value="Birthday">生日</option>
            <option value="Other">其他</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm"
              disabled={saving}
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2 px-3 bg-love-500 text-white rounded-lg text-sm disabled:opacity-50"
              disabled={saving}
            >
              {saving ? '保存中...' : '添加'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {milestones.map(milestone => (
          <div key={milestone.id} className="bg-white p-3 rounded-xl shadow-sm border border-love-50 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-800">{milestone.title}</p>
              <p className="text-xs text-gray-500">{milestone.date}</p>
            </div>
            <button
              onClick={() => handleDelete(milestone.id)}
              className="text-red-400 hover:text-red-600 p-1"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {milestones.length === 0 && !isAdding && (
          <p className="text-sm text-gray-400 text-center py-4">还没有里程碑</p>
        )}
      </div>
    </div>
  );
};