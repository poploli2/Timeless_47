import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Timeline } from './components/Timeline';
import { AddMemory } from './components/AddMemory';
import { LoveAssistant } from './components/LoveAssistant';
import { MilestoneManager } from './components/MilestoneManager';
import { AppView, Memory, Milestone } from './types';
import { UserCircle2 } from 'lucide-react';
import { getMemories, getMilestones, createMemory, updateMemory, deleteMemory } from './services/dataService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.TIMELINE);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings - 从环境变量读取
  const startDate = import.meta.env.VITE_START_DATE;
  const coupleName = import.meta.env.VITE_COUPLE_NAME;

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [memoriesResult, milestonesResult] = await Promise.all([
        getMemories(),
        getMilestones()
      ]);

      if (memoriesResult.success && memoriesResult.data) {
        setMemories(memoriesResult.data as Memory[]);
      }

      if (milestonesResult.success && milestonesResult.data) {
        setMilestones(milestonesResult.data as Milestone[]);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async (memory: Memory) => {
    // 保存到后端
    const result = await createMemory(memory);

    if (result.success) {
      // 重新加载数据
      await loadData();
      setView(AppView.TIMELINE);
    } else {
      console.error('保存回忆失败:', result.error);
      alert('保存失败: ' + result.error);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    const result = await deleteMemory(id);

    if (result.success) {
      await loadData();
    } else {
      alert('删除失败: ' + result.error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-gray-500">加载中...</p>
        </div>
      );
    }

    switch (view) {
      case AppView.TIMELINE:
        return (
          <div className="animate-fade-in">
            <Hero startDate={startDate} names={coupleName} milestones={milestones} />
            <Timeline
              memories={memories}
              onDelete={handleDeleteMemory}
            />
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
                <span className="text-gray-600 text-sm">里程碑</span>
                <span className="font-bold text-gray-800 text-sm">{milestones.length}</span>
              </div>
            </div>

            <MilestoneManager
              milestones={milestones}
              onUpdate={(updated) => {
                setMilestones(updated);
                loadData(); // 重新加载以同步
              }}
            />
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