import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Timeline } from './components/Timeline';
import { AddMemory } from './components/AddMemory';
import { LoveAssistant } from './components/LoveAssistant';
import { MilestoneManager } from './components/MilestoneManager';
import { Login } from './components/Login';
import { AppView, Memory, Milestone } from './types';
import { UserCircle2 } from 'lucide-react';
import { getMemories, getMilestones, createMemory, updateMemory, deleteMemory } from './services/dataService';
import { isAuthenticated, onAuthRequired } from './services/authService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.TIMELINE);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Settings - 从环境变量读取
  const startDate = import.meta.env.VITE_START_DATE;
  const coupleName = import.meta.env.VITE_COUPLE_NAME;

  // 注册全局认证拦截器
  useEffect(() => {
    const unsubscribe = onAuthRequired(() => {
      setIsLoggedIn(false);
      setView(AppView.LOGIN);
    });
    return unsubscribe;
  }, []);

  // 加载数据
  useEffect(() => {
    // 初始检查是否已登录（仅检查本地 token）
    if (isAuthenticated()) {
      setIsLoggedIn(true);
    }
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

      // 如果数据加载成功，确认为已登录状态
      if (memoriesResult.success) {
        setIsLoggedIn(true);
      }

    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setView(AppView.TIMELINE);
    loadData();
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

    // 如果当前视图是登录页，直接显示
    if (view === AppView.LOGIN) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    switch (view) {
      case AppView.TIMELINE:
        return (
          <div key="timeline" className="animate-fade-in space-y-8">
            <Hero startDate={startDate} names={coupleName} milestones={milestones} />
            <Timeline
              memories={memories}
              onDelete={handleDeleteMemory}
            />
          </div>
        );
      case AppView.ADD_MEMORY:
        // 如果未登录，进入添加页面时直接跳转登录
        if (!isLoggedIn) {
          setView(AppView.LOGIN);
          return null;
        }
        return (
          <div key="add-memory" className="pt-6">
            <AddMemory
              onAdd={handleAddMemory}
              onCancel={() => setView(AppView.TIMELINE)}
            />
          </div>
        );
      case AppView.AI_TOOLS:
        // 如果未登录，进入 AI 工具时直接跳转登录
        if (!isLoggedIn) {
          setView(AppView.LOGIN);
          return null;
        }
        return (
          <div key="ai-tools" className="pt-6">
            <LoveAssistant />
          </div>
        );

      case AppView.PROFILE:
        return (
          <div key="profile" className="flex flex-col items-center pt-16 px-6 animate-fade-in pb-32 max-w-lg mx-auto">
            {/* 头像区域 */}
            <div className="relative mb-6 group">
              <div className="absolute inset-0 bg-gradient-to-br from-love-300 to-rose-300 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center text-love-500 shadow-xl border-4 border-white">
                <UserCircle2 size={80} strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-2">{coupleName}</h2>
            <div className="flex items-center space-x-2 text-slate-500 bg-white/50 px-4 py-1.5 rounded-full backdrop-blur-sm border border-white/50 shadow-sm">
              <span className="text-sm font-medium">从 {startDate} 开始在一起</span>
            </div>

            {/* 统计卡片 */}
            <div className="mt-10 w-full grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow duration-300">
                <span className="text-4xl font-bold bg-gradient-to-br from-love-500 to-rose-500 bg-clip-text text-transparent mb-1">
                  {memories.length}
                </span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">美好回忆</span>
              </div>
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow duration-300">
                <span className="text-4xl font-bold bg-gradient-to-br from-love-500 to-rose-500 bg-clip-text text-transparent mb-1">
                  {milestones.length}
                </span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">里程碑</span>
              </div>
            </div>

            <div className="w-full mt-8">
              <MilestoneManager
                milestones={milestones}
                onUpdate={(updated) => {
                  setMilestones(updated);
                  loadData(); // 重新加载以同步
                }}
                onAuthRequired={() => setView(AppView.LOGIN)}
              />
            </div>
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
      {view !== AppView.LOGIN && <Navbar currentView={view} onNavigate={(target) => {
        // 导航拦截：如果目标是需要认证的页面且未登录，跳转登录
        if ((target === AppView.ADD_MEMORY || target === AppView.AI_TOOLS) && !isLoggedIn) {
          setView(AppView.LOGIN);
        } else {
          setView(target);
        }
      }} />}
    </div>
  );
};

export default App;