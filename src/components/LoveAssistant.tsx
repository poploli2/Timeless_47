import React, { useState } from 'react';
import { Heart, CalendarHeart, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { generateDateIdeas, generateLoveLetter } from "../services/aiService";
import { DateIdeaParams, LoveLetterParams } from '../types';

export const LoveAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'letter' | 'date'>('letter');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  // Letter State
  const [letterParams, setLetterParams] = useState<LoveLetterParams>({ tone: 'Romantic', context: '', length: 'Short' });
  const [partnerName, setPartnerName] = useState('');

  // Date State
  const [dateParams, setDateParams] = useState<DateIdeaParams>({ weather: 'Sunny', budget: 'Medium', vibe: 'Relaxing' });

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    setCopied(false);

    if (activeTab === 'letter') {
      const res = await generateLoveLetter(letterParams, partnerName || 'my love');
      setResult(res);
    } else {
      const res = await generateDateIdeas(dateParams);
      setResult(res);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 py-6 pb-24 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-love-700 to-rose-600 bg-clip-text text-transparent mb-8 animate-fade-in-down">
        💝 恋爱助手
      </h2>

      <div className="bg-white rounded-3xl shadow-love-lg border-2 border-love-100 overflow-hidden animate-fade-in">
        {/* Tabs - 增强样式 */}
        <div className="flex border-b-2 border-love-100 bg-gradient-to-r from-love-50/50 to-rose-50/30">
          <button
            onClick={() => { setActiveTab('letter'); setResult(''); }}
            className={`flex-1 py-5 text-base font-bold flex justify-center items-center space-x-2 transition-all duration-300 relative ${activeTab === 'letter'
                ? 'text-love-600'
                : 'text-gray-400 hover:text-love-400 hover:bg-love-50/50'
              }`}
          >
            <Heart size={20} className={activeTab === 'letter' ? 'fill-love-500' : ''} />
            <span>情书</span>
            {activeTab === 'letter' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-love-500 to-rose-500 rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('date'); setResult(''); }}
            className={`flex-1 py-5 text-base font-bold flex justify-center items-center space-x-2 transition-all duration-300 relative ${activeTab === 'date'
                ? 'text-love-600'
                : 'text-gray-400 hover:text-love-400 hover:bg-love-50/50'
              }`}
          >
            <CalendarHeart size={20} className={activeTab === 'date' ? 'fill-love-500' : ''} />
            <span>约会灵感</span>
            {activeTab === 'date' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-love-500 to-rose-500 rounded-t-full"></div>
            )}
          </button>
        </div>

        <div className="p-8">
          {/* Letter Inputs */}
          {activeTab === 'letter' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">伴侣昵称</label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-love-500 focus:ring-2 focus:ring-love-400/50 transition-all duration-200 hover:border-love-300"
                  placeholder="昵称"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">语气</label>
                  <select
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-love-500 focus:ring-2 focus:ring-love-400/50 transition-all duration-200 hover:border-love-300 cursor-pointer"
                    value={letterParams.tone}
                    onChange={(e) => setLetterParams({ ...letterParams, tone: e.target.value })}
                  >
                    <option>浪漫</option>
                    <option>幽默</option>
                    <option>道歉</option>
                    <option>诗意</option>
                    <option>火辣</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">长度</label>
                  <select
                    className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-love-500 focus:ring-2 focus:ring-love-400/50 transition-all duration-200 hover:border-love-300 cursor-pointer"
                    value={letterParams.length}
                    onChange={(e) => setLetterParams({ ...letterParams, length: e.target.value })}
                  >
                    <option>短小精悍</option>
                    <option>中等</option>
                    <option>详细长文</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">场合 / 背景</label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-love-500 focus:ring-2 focus:ring-love-400/50 transition-all duration-200 hover:border-love-300"
                  placeholder="例如:纪念日、想你了、无理由"
                  value={letterParams.context}
                  onChange={(e) => setLetterParams({ ...letterParams, context: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Date Inputs */}
          {activeTab === 'date' && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">天气</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-love-500 focus:ring-2 focus:ring-love-400/50 transition-all duration-200 hover:border-love-300 cursor-pointer"
                  value={dateParams.weather}
                  onChange={(e) => setDateParams({ ...dateParams, weather: e.target.value })}
                >
                  <option>晴朗</option>
                  <option>下雨</option>
                  <option>寒冷 / 下雪</option>
                  <option>炎热 / 潮湿</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">预算</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-love-500 focus:ring-2 focus:ring-love-400/50 transition-all duration-200 hover:border-love-300 cursor-pointer"
                  value={dateParams.budget}
                  onChange={(e) => setDateParams({ ...dateParams, budget: e.target.value })}
                >
                  <option>免费</option>
                  <option>便宜 ($)</option>
                  <option>适中 ($$)</option>
                  <option>豪华 ($$$)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">氛围</label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl border-2 border-gray-200 focus:border-love-500 focus:ring-2 focus:ring-love-400/50 transition-all duration-200 hover:border-love-300 cursor-pointer"
                  value={dateParams.vibe}
                  onChange={(e) => setDateParams({ ...dateParams, vibe: e.target.value })}
                >
                  <option>放松</option>
                  <option>冒险</option>
                  <option>美食</option>
                  <option>文化</option>
                  <option>活力</option>
                </select>
              </div>
            </div>
          )}

          {/* 生成按钮 - 增强样式 */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-8 w-full bg-gradient-to-r from-love-500 to-rose-500 text-white font-bold py-5 rounded-2xl hover:from-love-600 hover:to-rose-600 shadow-love hover:shadow-love-lg transition-all duration-300 flex justify-center items-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                <span className="text-lg">正在咨询丘比特...</span>
              </>
            ) : (
              <>
                <Sparkles size={24} className="animate-pulse" />
                <span className="text-lg">生成</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results - 增强样式 */}
      {result && (
        <div className="mt-8 glass p-8 rounded-3xl shadow-love-lg border-2 border-love-100 relative animate-bounce-in">
          <div className="absolute top-6 right-6">
            <button
              onClick={handleCopy}
              className="p-3 rounded-xl hover:bg-love-100 text-gray-400 hover:text-love-600 transition-all duration-200 hover:scale-110"
            >
              {copied ? (
                <Check size={22} className="text-green-500" />
              ) : (
                <Copy size={22} />
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-love-500 to-rose-500 rounded-full"></div>
            <h3 className="text-base font-bold text-love-700 uppercase tracking-wider">
              {activeTab === 'letter' ? '你的情书' : '约会建议'}
            </h3>
          </div>

          <div className="prose prose-base prose-love text-gray-700 whitespace-pre-wrap font-handwriting text-xl leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};