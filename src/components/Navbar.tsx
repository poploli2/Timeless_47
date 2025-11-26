import React from 'react';
import { Home, PlusCircle, Sparkles, User } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.TIMELINE, icon: Home, label: '首页' },
    { view: AppView.ADD_MEMORY, icon: PlusCircle, label: '添加' },
    { view: AppView.AI_TOOLS, icon: Sparkles, label: 'AI' },
    { view: AppView.PROFILE, icon: User, label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t-2 border-love-100 px-6 py-3 pb-safe z-50 shadow-[0_-8px_16px_-4px_rgba(244,63,94,0.1)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center relative transition-all duration-300 ${isActive ? 'text-love-600 scale-110' : 'text-gray-400 hover:text-love-400 hover:scale-105'
                }`}
            >
              {/* 激活背景光晕 */}
              {isActive && (
                <div className="absolute inset-0 -inset-3 bg-gradient-to-br from-love-100 to-rose-100 rounded-2xl blur-md opacity-50 animate-pulse-slow"></div>
              )}

              {/* 图标 */}
              <div className="relative">
                <Icon
                  size={isActive ? 28 : 24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={isActive ? 'fill-love-100' : ''}
                />
              </div>

              {/* 标签文字 */}
              <span className={`text-xs font-semibold mt-1 transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0'
                }`}>
                {item.label}
              </span>

              {/* 激活指示点 */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-gradient-to-r from-love-500 to-rose-500 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};