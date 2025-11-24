import React from 'react';
import { Home, PlusCircle, Sparkles, User, Image as ImageIcon } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { view: AppView.TIMELINE, icon: Home, label: 'Home' },
    { view: AppView.ADD_MEMORY, icon: PlusCircle, label: 'Add' },
    { view: AppView.AI_TOOLS, icon: Sparkles, label: 'Assistant' },
    { view: AppView.GALLERY, icon: ImageIcon, label: 'Gallery' },
    { view: AppView.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-love-100 px-4 py-3 pb-6 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-1/5 transition-all duration-300 ${
                isActive ? 'text-love-600 scale-110' : 'text-gray-400 hover:text-love-400'
              }`}
            >
              <Icon size={isActive ? 26 : 24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0 hidden'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};