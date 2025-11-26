import React from 'react';
import { Memory, Mood } from '../types';
import { MapPin, Calendar, Trash2, Heart } from 'lucide-react';

interface TimelineProps {
  memories: Memory[];
  onDelete?: (id: string) => void;
}

const moodColors: Record<Mood, string> = {
  [Mood.HAPPY]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [Mood.ROMANTIC]: 'bg-rose-100 text-rose-700 border-rose-200',
  [Mood.ADVENTUROUS]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [Mood.COZY]: 'bg-orange-100 text-orange-700 border-orange-200',
  [Mood.SILLY]: 'bg-purple-100 text-purple-700 border-purple-200',
  [Mood.GRATEFUL]: 'bg-blue-100 text-blue-700 border-blue-200',
};

export const Timeline: React.FC<TimelineProps> = ({ memories, onDelete }) => {
  // Sort memories by date descending
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`确定要删除「${title}」吗？`)) {
      onDelete?.(id);
    }
  };

  return (
    <div className="px-4 pb-32 max-w-2xl mx-auto">
      <div className="flex items-center mb-10 pl-2 animate-fade-in-down">
        <div className="w-1 h-8 bg-gradient-to-b from-love-500 to-rose-500 rounded-full mr-4"></div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          我们的旅程
        </h2>
      </div>

      <div className="relative ml-4 space-y-12">
        {/* 极简时间线 */}
        <div className="absolute left-[7px] top-2 bottom-0 w-0.5 bg-slate-100"></div>

        {sortedMemories.map((memory, index) => (
          <div
            key={memory.id}
            className="relative pl-12 group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* 时间线节点 - 极简圆点 */}
            <div className="absolute left-0 top-6 w-4 h-4 rounded-full bg-white border-[3px] border-love-300 shadow-sm z-10 group-hover:scale-125 group-hover:border-love-500 transition-all duration-300"></div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-love-500/5 hover:-translate-y-1 transition-all duration-500 group-hover:border-love-100/50">
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                    <span className="bg-slate-50 px-2 py-1 rounded-md text-slate-500">
                      {new Date(memory.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-love-600 transition-colors">
                    {memory.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2 pl-4">
                  {/* 优化的心情标签 - 更淡雅 */}
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${moodColors[memory.mood].replace('bg-', 'bg-opacity-50 bg-').replace('border-', 'border-opacity-30 border-')}`}>
                    {memory.mood}
                  </span>

                  {/* 删除按钮 */}
                  {onDelete && (
                    <button
                      onClick={() => handleDelete(memory.id, memory.title)}
                      className="p-2 hover:bg-red-50 rounded-full text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Image */}
              {memory.imageUrl && (
                <div className="mb-6 overflow-hidden rounded-2xl shadow-sm">
                  <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Content */}
              <div className="prose prose-slate prose-sm max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[15px]">
                  {memory.content}
                </p>
              </div>

              {/* Footer Metadata */}
              {memory.location && (
                <div className="flex items-center text-xs font-medium text-slate-400 mt-5 pt-4 border-t border-slate-50">
                  <MapPin size={14} className="mr-1.5 text-love-400" />
                  {memory.location}
                </div>
              )}
            </div>
          </div>
        ))}

        {sortedMemories.length === 0 && (
          <div className="pl-12 py-12">
            <div className="bg-slate-50 rounded-3xl p-8 text-center border border-dashed border-slate-200">
              <Heart size={40} className="mx-auto mb-4 text-slate-300" />
              <p className="text-slate-500 font-medium">
                还没有回忆呢
              </p>
              <p className="text-slate-400 text-sm mt-2">
                点击底部 + 按钮，开始记录你们的故事
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
