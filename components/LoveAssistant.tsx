import React, { useState } from 'react';
import { Heart, CalendarHeart, Loader2, Copy, Check, Sparkles } from 'lucide-react';
import { generateDateIdeas, generateLoveLetter } from '../services/geminiService';
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
      <h2 className="text-2xl font-bold text-love-800 mb-6">Love Assistant</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-love-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => { setActiveTab('letter'); setResult(''); }}
            className={`flex-1 py-4 text-sm font-medium flex justify-center items-center space-x-2 transition-colors ${
              activeTab === 'letter' ? 'bg-love-50 text-love-600 border-b-2 border-love-500' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Heart size={18} />
            <span>Love Letter</span>
          </button>
          <button
            onClick={() => { setActiveTab('date'); setResult(''); }}
            className={`flex-1 py-4 text-sm font-medium flex justify-center items-center space-x-2 transition-colors ${
              activeTab === 'date' ? 'bg-love-50 text-love-600 border-b-2 border-love-500' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <CalendarHeart size={18} />
            <span>Date Ideas</span>
          </button>
        </div>

        <div className="p-6">
          {/* Letter Inputs */}
          {activeTab === 'letter' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Partner's Name</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-love-400 focus:ring-love-400"
                  placeholder="Name"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tone</label>
                  <select
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                    value={letterParams.tone}
                    onChange={(e) => setLetterParams({ ...letterParams, tone: e.target.value })}
                  >
                    <option>Romantic</option>
                    <option>Funny</option>
                    <option>Apologetic</option>
                    <option>Poetic</option>
                    <option>Spicy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Length</label>
                  <select
                    className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                    value={letterParams.length}
                    onChange={(e) => setLetterParams({ ...letterParams, length: e.target.value })}
                  >
                    <option>Short & Sweet</option>
                    <option>Medium</option>
                    <option>Long & Detailed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Occasion / Context</label>
                <input
                  type="text"
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-love-400 focus:ring-love-400"
                  placeholder="e.g., Anniversary, Miss you, Just because"
                  value={letterParams.context}
                  onChange={(e) => setLetterParams({ ...letterParams, context: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Date Inputs */}
          {activeTab === 'date' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Weather</label>
                <select
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                  value={dateParams.weather}
                  onChange={(e) => setDateParams({ ...dateParams, weather: e.target.value })}
                >
                  <option>Sunny</option>
                  <option>Rainy</option>
                  <option>Cold / Snowy</option>
                  <option>Hot / Humid</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Budget</label>
                <select
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                  value={dateParams.budget}
                  onChange={(e) => setDateParams({ ...dateParams, budget: e.target.value })}
                >
                  <option>Free</option>
                  <option>Cheap ($)</option>
                  <option>Medium ($$)</option>
                  <option>Luxury ($$$)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Vibe</label>
                <select
                  className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                  value={dateParams.vibe}
                  onChange={(e) => setDateParams({ ...dateParams, vibe: e.target.value })}
                >
                  <option>Relaxing</option>
                  <option>Adventurous</option>
                  <option>Foodie</option>
                  <option>Cultural</option>
                  <option>Active</option>
                </select>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="mt-6 w-full bg-love-500 text-white font-medium py-3 rounded-xl hover:bg-love-600 transition-colors flex justify-center items-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Consulting Cupid...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                <span>Generate</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-md border border-love-100 relative animate-fade-in-up">
          <div className="absolute top-4 right-4">
            <button 
              onClick={handleCopy}
              className="text-gray-400 hover:text-love-500 transition-colors"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          </div>
          <h3 className="text-sm font-bold text-love-800 mb-3 uppercase tracking-wide">
            {activeTab === 'letter' ? 'Your Letter' : 'Date Ideas'}
          </h3>
          <div className="prose prose-sm prose-love text-gray-700 whitespace-pre-wrap font-handwriting text-lg leading-relaxed">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};