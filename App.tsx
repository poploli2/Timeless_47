import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Timeline } from './components/Timeline';
import { AddMemory } from './components/AddMemory';
import { LoveAssistant } from './components/LoveAssistant';
import { Gallery } from './components/Gallery';
import { MilestoneManager } from './components/MilestoneManager';
import { AppView, Memory, Mood, Milestone } from './types';
import { UserCircle2 } from 'lucide-react';

// Sample Data
const INITIAL_MEMORIES: Memory[] = [
  {
    id: '1',
    title: 'Our First Coffee Date',
    date: '2023-10-15',
    content: 'We met at the little cafe on the corner. I was so nervous, but your smile instantly calmed me down. We talked for hours about everything and nothing.',
    location: 'Corner Bistro',
    mood: Mood.ROMANTIC,
    imageUrl: 'https://picsum.photos/id/42/800/450'
  },
  {
    id: '2',
    title: 'Weekend Getaway',
    date: '2024-02-14',
    content: 'Surprised you with a trip to the mountains. The cabin was cozy, and the fireplace was perfect. I loved watching the snow fall with you.',
    location: 'Aspen Cabin',
    mood: Mood.COZY,
    imageUrl: 'https://picsum.photos/id/29/800/450'
  }
];

const INITIAL_MILESTONES: Milestone[] = [
  { id: '1', title: 'First Date', date: '2023-10-15', type: 'Anniversary' },
  { id: '2', title: 'Partner Birthday', date: '1998-05-20', type: 'Birthday' }
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
      case AppView.GALLERY:
        return <Gallery memories={memories} />;
      case AppView.PROFILE:
        return (
          <div className="flex flex-col items-center pt-12 px-4 animate-fade-in pb-24">
             <div className="w-24 h-24 bg-love-100 rounded-full flex items-center justify-center mb-4 text-love-500 shadow-inner">
               <UserCircle2 size={64} />
             </div>
             <h2 className="text-2xl font-bold text-gray-800">{coupleName}</h2>
             <p className="text-gray-500 mt-1 text-sm">Together since {startDate}</p>
             
             <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-love-100 max-w-xs w-full">
                <h3 className="font-medium text-love-700 mb-2 border-b border-love-50 pb-2">App Stats</h3>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 text-sm">Memories</span>
                  <span className="font-bold text-gray-800 text-sm">{memories.length}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600 text-sm">Photos</span>
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