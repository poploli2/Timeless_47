import React from 'react';
import { Memory, Mood } from '../types';
import { MapPin, Calendar, Tag } from 'lucide-react';

interface TimelineProps {
  memories: Memory[];
}

const moodColors: Record<Mood, string> = {
  [Mood.HAPPY]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [Mood.ROMANTIC]: 'bg-rose-100 text-rose-700 border-rose-200',
  [Mood.ADVENTUROUS]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [Mood.COZY]: 'bg-orange-100 text-orange-700 border-orange-200',
  [Mood.SILLY]: 'bg-purple-100 text-purple-700 border-purple-200',
  [Mood.GRATEFUL]: 'bg-blue-100 text-blue-700 border-blue-200',
};

export const Timeline: React.FC<TimelineProps> = ({ memories }) => {
  // Sort memories by date descending
  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="px-4 py-6 pb-24 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-love-800 mb-6 pl-2">Our Journey</h2>
      
      <div className="relative border-l-2 border-love-200 ml-3 space-y-8">
        {sortedMemories.map((memory) => (
          <div key={memory.id} className="relative pl-8 group">
            {/* Dot on timeline */}
            <div className="absolute -left-[9px] top-4 w-4 h-4 rounded-full bg-love-400 border-2 border-white shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
            
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-love-100 hover:shadow-md transition-shadow duration-300">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                    <Calendar size={12} />
                    <span>{new Date(memory.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{memory.title}</h3>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${moodColors[memory.mood]}`}>
                  {memory.mood}
                </span>
              </div>

              {/* Image Placeholder */}
              {memory.imageUrl && (
                <div className="mb-4 overflow-hidden rounded-xl aspect-video bg-gray-100">
                  <img src={memory.imageUrl} alt={memory.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                </div>
              )}

              {/* Content */}
              <p className="text-gray-600 leading-relaxed text-sm mb-3 whitespace-pre-wrap">
                {memory.content}
              </p>

              {/* Footer Metadata */}
              {memory.location && (
                <div className="flex items-center text-xs text-love-400 font-medium mt-2">
                  <MapPin size={12} className="mr-1" />
                  {memory.location}
                </div>
              )}
            </div>
          </div>
        ))}

        {sortedMemories.length === 0 && (
          <div className="pl-8 py-10 text-center text-gray-400 italic">
            No memories yet. Click the + button to add your first one!
          </div>
        )}
      </div>
    </div>
  );
};
