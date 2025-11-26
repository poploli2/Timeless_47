import React, { useState } from 'react';
import { Milestone } from '../types';
import { Plus, Trash2, X } from 'lucide-react';
import { createMilestone, deleteMilestone } from '../services/dataService';

interface MilestoneManagerProps {
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
  onAuthRequired?: () => void;
}

export const MilestoneManager: React.FC<MilestoneManagerProps> = ({ milestones, onUpdate, onAuthRequired }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('Anniversary');
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!title || !date) return;

    setSaving(true);
    const result = await createMilestone({ title, date, type });

    if (result.authRequired) {
      onAuthRequired?.();
      setSaving(false);
      return;
    }

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
    if (!confirm('确定要删除这个里程碑吗?')) return;

    const result = await deleteMilestone(id);

    if (result.authRequired) {
      onAuthRequired?.();
      return;
    }

    if (result.success) {
      onUpdate(milestones.filter(m => m.id !== id));
    } else {
      alert('删除失败: ' + result.error);
    }
  };

  return (
    <div className="mt-10 w-full max-w-md">
      {/* 标题栏 */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center">
          <span className="w-1.5 h-6 bg-love-500 rounded-full mr-3"></span>
          里程碑
        </h3>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`p-2 rounded-full transition-all duration-300 ${isAdding
            ? 'bg-slate-100 text-slate-500 rotate-45'
            : 'bg-love-50 text-love-500 hover:bg-love-100 hover:scale-110'
            }`}
        >
          <Plus size={20} />
        </button>
      </div>

      {/* 添加表单 */}
      {isAdding && (
        <div className="bg-white p-5 rounded-3xl shadow-lg shadow-love-500/10 border border-love-100 mb-6 space-y-4 animate-fade-in-down">
          <div>
            <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如: 第一次约会"
              className="w-full rounded-xl bg-slate-50 border-0 text-slate-800 text-sm p-3.5 focus:ring-2 focus:ring-love-200 transition-all duration-200 placeholder-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">日期</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border-0 text-slate-800 text-sm p-3.5 focus:ring-2 focus:ring-love-200 transition-all duration-200"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 ml-1 mb-1 block uppercase tracking-wider">类型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border-0 text-slate-800 text-sm p-3.5 focus:ring-2 focus:ring-love-200 transition-all duration-200 cursor-pointer appearance-none"
              >
                <option value="Anniversary">纪念日</option>
                <option value="Birthday">生日</option>
                <option value="Other">其他</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all duration-200"
              disabled={saving}
            >
              取消
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-love-500 to-rose-500 text-white rounded-xl text-sm font-bold shadow-md shadow-love-500/20 hover:shadow-love-500/40 hover:scale-[1.02] transition-all duration-200 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? '保存中...' : '添加'}
            </button>
          </div>
        </div>
      )}

      {/* 里程碑列表 */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-love-200 hover:shadow-md transition-all duration-300 group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm
                ${milestone.type === 'Birthday' ? 'bg-amber-100 text-amber-500' :
                  milestone.type === 'Anniversary' ? 'bg-love-100 text-love-500' : 'bg-slate-100 text-slate-500'}`}>
                {milestone.type === 'Birthday' ? '🎂' : milestone.type === 'Anniversary' ? '💝' : '📌'}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {milestone.title}
                </p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {new Date(milestone.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(milestone.id)}
              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {milestones.length === 0 && !isAdding && (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-sm text-slate-400 font-medium">还没有里程碑</p>
            <p className="text-xs text-slate-300 mt-1">点击右上角 + 添加重要日期</p>
          </div>
        )}
      </div>
    </div>
  );
};