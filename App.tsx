import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Timeline } from './components/Timeline';
import { AddMemory } from './components/AddMemory';
import { LoveAssistant } from './components/LoveAssistant';
import { MilestoneManager } from './components/MilestoneManager';
import { AppView, Memory, Mood, Milestone } from './types';
import { UserCircle2 } from 'lucide-react';

// Sample Data
const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: '第一次喝咖啡',
    date: '2023-10-15',
    content: '我们在街角的咖啡馆相遇。我当时很紧张，但你的笑容立刻让我平静下来。我们聊了很久，无所不谈。',
    location: 'Corner Bistro',
    mood: Mood.ROMANTIC,
    imageUrl: 'https://picsum.photos/id/42/800/450'
  },
  {
    id: '2',
    title: '周末度假',
    date: '2024-02-14',
    content: '带你去山里度假给你一个惊喜。小屋很舒适，壁炉很完美。我喜欢和你一起看雪落下。',
    location: 'Aspen Cabin',
    mood: Mood.COZY,
    imageUrl: 'https://picsum.photos/id/29/800/450'
  }
];

const INITIAL_MILESTONES: Milestone[] = [
  { id: '1', title: '第一次约会', date: '2023-10-15', type: 'Anniversary' },
  { id: '2', title: '伴侣生日', date: '1998-05-20', type: 'Birthday' }
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.TIMELINE);
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);

  // Settings
  const startDate = '2023-10-15'; // Matches first date
  const coupleName = 'Alex & Sam';

  const handleAddMemory = (memory: Memory) => {
    setMemories([memory, ...memories]);
    setView(AppView.TIMELINE);
  };

  const renderContent = () => {
    switch (view) {
      case AppView.TIMELINE:
        return (
          <div className="animate-fade-in">
            <Hero startDate={startDate} names={coupleName} milestones={milestones} />
            <Timeline memories={memories} />
          </div>
        );
      case AppView.ADD_MEMORY:
        return (
          <AddMemory
            onAdd={handleAddMemory}
            onCancel={() => setView(AppView.TIMELINE)}
          />
        );
      case AppView.AI_TOOLS:
        return <LoveAssistant />;

      case AppView.PROFILE:
        return (
          <div className="flex flex-col items-center pt-12 px-4 animate-fade-in pb-24">
            <div className="w-24 h-24 bg-love-100 rounded-full flex items-center justify-center mb-4 text-love-500 shadow-inner">
              <UserCircle2 size={64} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{coupleName}</h2>
            <p className="text-gray-500 mt-1 text-sm">从 {startDate} 开始在一起</p>

            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-love-100 max-w-xs w-full">
              <h3 className="font-medium text-love-700 mb-2 border-b border-love-50 pb-2">应用统计</h3>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">回忆</span>
                <span className="font-bold text-gray-800 text-sm">{memories.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600 text-sm">照片</span>
                <span className="font-bold text-gray-800 text-sm">
                  {memories.filter(m => m.imageUrl).length}
                </span>
              </div>
            </div>

            <MilestoneManager milestones={milestones} onUpdate={setMilestones} />
          </div>
        );
      default:
        return <Timeline memories={memories} />;
    }
  };

  return (
    <div className="min-h-screen bg-love-50 font-sans selection:bg-love-200 selection:text-love-900">
      <main className="pb-20">
        {renderContent()}
      </main>
      <Navbar currentView={view} onNavigate={setView} />
    </div>
  );
};

export default App;