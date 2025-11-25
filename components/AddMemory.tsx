import React, { useState } from 'react';
import { Memory, Mood } from '../types';
import { Wand2, Loader2, Save } from 'lucide-react';
import { polishMemoryContent } from "../services/aiService";

interface AddMemoryProps {
  onAdd: (memory: Memory) => void;
  onCancel: () => void;
}

export const AddMemory: React.FC<AddMemoryProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [isPolishing, setIsPolishing] = useState(false);

  const handlePolish = async () => {
    if (!content.trim()) return;
    setIsPolishing(true);
    const polished = await polishMemoryContent(content, mood);
    setContent(polished);
    setIsPolishing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newMemory: Memory = {
      id: Date.now().toString(),
      title,
      date,
      content,
      location,
      mood,
      imageUrl: `https://picsum.photos/800/450?random=${Date.now()}` // Using placeholder as per requirements
    };

    onAdd(newMemory);
  };

  return (
    <div className="px-4 py-6 pb-24 max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-love-800 mb-6">新回忆</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-love-500 focus:ring-love-500 p-3"
            placeholder="例如：我们的第一次徒步"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border-gray-200 shadow-sm focus:border-love-500 focus:ring-love-500 p-3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">心情</label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value as Mood)}
              className="w-full rounded-xl border-gray-200 shadow-sm focus:border-love-500 focus:ring-love-500 p-3 bg-white"
            >
              {Object.values(Mood).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地点（可选）</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-love-500 focus:ring-love-500 p-3"
            placeholder="例如：法国巴黎"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">发生了什么？</label>
            <button
              type="button"
              onClick={handlePolish}
              disabled={isPolishing || !content}
              className="text-xs flex items-center space-x-1 text-love-600 hover:text-love-700 disabled:opacity-50 font-medium"
            >
              {isPolishing ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
              <span>AI 润色</span>
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-love-500 focus:ring-love-500 p-3"
            placeholder="记录下今天发生的事情..."
            required
          />
          <p className="text-xs text-gray-400 mt-1">使用 'AI 润色' 让你的笔记更浪漫。</p>
        </div>

        <div className="pt-4 flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 bg-love-500 text-white rounded-xl font-medium hover:bg-love-600 shadow-md shadow-love-200 transition-colors flex justify-center items-center space-x-2"
          >
            <Save size={18} />
            <span>保存回忆</span>
          </button>
        </div>
      </form>
    </div>
  );
};
