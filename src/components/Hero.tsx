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

  return (
    <div className="relative bg-gradient-to-b from-love-200 to-love-50 pt-12 pb-8 px-6 rounded-b-[3rem] shadow-lg overflow-hidden mb-6">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white opacity-20 rounded-full blur-2xl"></div>
      <div className="absolute top-[40%] left-[-20px] w-24 h-24 bg-love-400 opacity-10 rounded-full blur-xl"></div>

      <div className="relative z-10 text-center">
        <h1 className="font-handwriting text-4xl text-love-700 mb-2">{names}</h1>
        <div className="flex items-center justify-center space-x-2 text-love-600 mb-6">
          <span className="text-sm font-medium tracking-wider uppercase">相爱了</span>
        </div>

        <div className="bg-white/60 backdrop-blur-sm inline-block px-8 py-4 rounded-2xl shadow-sm border border-white/50 mb-6">
          <div className="flex items-baseline justify-center space-x-2">
            <span className="text-5xl font-bold text-love-600">{daysTogether}</span>
            <span className="text-lg text-love-800 font-medium">天</span>
          </div>
        </div>

        {nextMilestone && (
          <div className="mx-auto max-w-xs bg-white/80 backdrop-blur-md rounded-xl p-3 flex items-center justify-between shadow-sm border border-love-100 animate-fade-in-up">
            <div className="flex items-center space-x-3">
              <div className="bg-love-100 p-2 rounded-full text-love-500">
                <CalendarClock size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase font-semibold">下一个纪念日</p>
                <p className="text-sm font-bold text-gray-800">{nextMilestone.title}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="block text-lg font-bold text-love-600">{nextMilestone.days}</span>
              <span className="text-[10px] text-love-400 font-medium uppercase">天后</span>
            </div>
          </div>
        )}

        {!nextMilestone && (
          <div className="mt-4 flex justify-center">
            <Heart className="text-love-500 animate-pulse fill-love-500" size={24} />
          </div>
        )}
      </div>
    </div>
  );
};