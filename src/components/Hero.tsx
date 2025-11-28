import React, { useState, useEffect } from 'react';
import { Heart, CalendarClock } from 'lucide-react';
import { Milestone } from '../types';

interface HeroProps {
  startDate: string; // YYYY-MM-DD
  names: string;
  milestones: Milestone[];
}

export const Hero: React.FC<HeroProps> = ({ startDate, names, milestones }) => {
  const [daysTogether, setDaysTogether] = useState(0);
  const [nextMilestone, setNextMilestone] = useState<{ title: string, days: number } | null>(null);

  // Calculate Days Together
  useEffect(() => {
    const start = new Date(startDate).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    const daysCount = Math.floor(diff / (1000 * 60 * 60 * 24));
    setDaysTogether(daysCount);
  }, [startDate]);

  // Calculate Next Milestone
  useEffect(() => {
    if (milestones.length === 0) {
      setNextMilestone(null);
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();

    const upcoming = milestones.map(m => {
      const mDate = new Date(m.date);
      // Create date object for this year
      let nextDate = new Date(currentYear, mDate.getMonth(), mDate.getDate());

      // If it has passed this year, move to next year
      if (nextDate < today) {
        nextDate = new Date(currentYear + 1, mDate.getMonth(), mDate.getDate());
      }

      const diffTime = nextDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return { title: m.title, days: diffDays };
    }).sort((a, b) => a.days - b.days);

    if (upcoming.length > 0) {
      setNextMilestone(upcoming[0]);
    }
  }, [milestones]);

  // 智能显示天数文案
  const getDaysText = (days: number): string => {
    if (days === 0) return '今天';
    if (days === 1) return '明天';
    if (days === 2) return '后天';
    return `${days}天后`;
  };

  return (
    <div className="relative bg-gradient-to-br from-love-50 via-white to-rose-50 pt-20 pb-16 px-6 rounded-b-[3rem] shadow-love-lg overflow-hidden mb-10">
      {/* 增强的装饰背景元素 - 更柔和有机 */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-gradient-to-br from-love-200/40 to-rose-200/40 opacity-50 rounded-full blur-3xl animate-pulse-slow mix-blend-multiply"></div>
      <div className="absolute top-[40%] left-[-10%] w-72 h-72 bg-gradient-to-tr from-warm-100/50 to-love-100/50 opacity-60 rounded-full blur-3xl animate-float mix-blend-multiply"></div>
      <div className="absolute bottom-[-10%] right-[20%] w-64 h-64 bg-rose-100/40 opacity-40 rounded-full blur-3xl"></div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* 标题 - 手写字体 */}
        <h1 className="font-handwriting text-5xl md:text-7xl text-love-600 mb-6 animate-fade-in-down drop-shadow-sm tracking-wide">
          {names}
        </h1>

        <div className="flex items-center justify-center space-x-3 text-love-400 mb-10 animate-fade-in">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-love-300"></div>
          <Heart size={14} className="fill-love-400 animate-pulse" />
          <span className="text-sm font-medium tracking-[0.2em] uppercase">相爱时光</span>
          <Heart size={14} className="fill-love-400 animate-pulse" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-love-300"></div>
        </div>

        {/* 天数显示 - 极简高级感 */}
        <div className="relative inline-block mb-12 animate-bounce-in group">
          <div className="absolute inset-0 bg-gradient-to-r from-love-200 to-rose-200 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
          <div className="relative">
            <span className="text-8xl md:text-9xl font-bold bg-gradient-to-b from-love-500 to-rose-600 bg-clip-text text-transparent drop-shadow-sm tracking-tighter leading-none">
              {daysTogether}
            </span>
            <span className="absolute -right-6 bottom-4 text-2xl text-love-400 font-handwriting -rotate-12">days</span>
          </div>
        </div>

        {/* 下一个纪念日 - 胶囊样式 */}
        {nextMilestone && (
          <div className="mx-auto max-w-xs glass rounded-full p-2 pr-6 flex items-center justify-between shadow-lg shadow-love-100/50 animate-fade-in-up hover:scale-105 transition-transform duration-300 cursor-default">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-love-500 to-rose-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md">
                <CalendarClock size={18} />
              </div>
              <div className="text-left flex flex-col">
                <span className="text-[10px] text-love-400 font-bold uppercase tracking-wider">Next Milestone</span>
                <span className="text-sm font-bold text-slate-700">{nextMilestone.title}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-love-600">
                {getDaysText(nextMilestone.days)}
              </span>
            </div>
          </div>
        )}

        {/* 无纪念日时显示爱心 */}
        {!nextMilestone && (
          <div className="mt-8 flex justify-center opacity-50">
            <Heart className="text-love-300 fill-love-100 animate-float" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};