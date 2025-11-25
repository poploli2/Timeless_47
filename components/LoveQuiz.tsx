import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Sparkles, Plus, Eye, EyeOff, MessageCircle, Loader2 } from 'lucide-react';
import { generateRelationshipQuestion } from "../services/aiService";

interface LoveQuizProps {
  questions: QuizQuestion[];
  onUpdateQuestions: (questions: QuizQuestion[]) => void;
}

export const LoveQuiz: React.FC<LoveQuizProps> = ({ questions, onUpdateQuestions }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;
    const newQ: QuizQuestion = {
      id: Date.now().toString(),
      question: customQuestion,
      isRevealed: false
    };
    onUpdateQuestions([newQ, ...questions]);
    setCustomQuestion('');
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    const text = await generateRelationshipQuestion();
    const newQ: QuizQuestion = {
      id: Date.now().toString(),
      question: text,
      isRevealed: false
    };
    onUpdateQuestions([newQ, ...questions]);
    setIsGenerating(false);
  };

  const handleAnswer = (id: string, field: 'myAnswer' | 'partnerAnswer', value: string) => {
    const updated = questions.map(q => q.id === id ? { ...q, [field]: value } : q);
    onUpdateQuestions(updated);
  };

  const toggleReveal = (id: string) => {
    const updated = questions.map(q => q.id === id ? { ...q, isRevealed: !q.isRevealed } : q);
    onUpdateQuestions(updated);
  };

  return (
    <div className="px-4 py-6 pb-24 max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-2xl font-bold text-love-800 mb-2">情侣问答</h2>
      <p className="text-sm text-gray-500 mb-6">一起回答这些问题，增进彼此了解。</p>

      {/* Add Question Actions */}
      <div className="flex space-x-2 mb-6">
        <form onSubmit={handleAddCustom} className="flex-1 flex space-x-2">
          <input
            type="text"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="输入自定义问题..."
            className="flex-1 rounded-xl border-gray-200 shadow-sm focus:border-love-500 focus:ring-love-500 p-3 text-sm"
          />
          <button
            type="submit"
            className="bg-love-100 text-love-600 p-3 rounded-xl hover:bg-love-200 transition-colors"
          >
            <Plus size={20} />
          </button>
        </form>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-gradient-to-r from-love-400 to-love-500 text-white p-3 rounded-xl shadow-md hover:opacity-90 transition-opacity flex items-center justify-center w-12"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        </button>
      </div>

      {/* Question List */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-love-100 overflow-hidden">
            <div className="p-4 bg-love-50/50 border-b border-love-50 flex justify-between items-start">
              <div className="flex space-x-3">
                <div className="bg-white p-2 rounded-lg shadow-sm text-love-400 h-fit">
                  <MessageCircle size={18} />
                </div>
                <h3 className="font-medium text-gray-800 pt-1 leading-snug">{q.question}</h3>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-love-400 uppercase tracking-wider mb-1">我的回答</label>
                <textarea
                  value={q.myAnswer || ''}
                  onChange={(e) => handleAnswer(q.id, 'myAnswer', e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-1 focus:ring-love-300 text-sm text-gray-700"
                  rows={2}
                  placeholder="你的想法..."
                />
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-love-400 uppercase tracking-wider">伴侣的回答</label>
                  <button
                    onClick={() => toggleReveal(q.id)}
                    className="text-gray-400 hover:text-love-500 transition-colors"
                  >
                    {q.isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className={`relative transition-all duration-500 ${q.isRevealed ? 'blur-0' : 'blur-sm select-none'}`}>
                  <textarea
                    value={q.partnerAnswer || ''}
                    onChange={(e) => handleAnswer(q.id, 'partnerAnswer', e.target.value)}
                    className="w-full p-3 bg-gray-50 rounded-xl border-none focus:ring-1 focus:ring-love-300 text-sm text-gray-700"
                    rows={2}
                    placeholder="伴侣在此输入..."
                  />
                  {!q.isRevealed && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="bg-white/80 px-3 py-1 rounded-full text-xs font-medium text-gray-500 shadow-sm">揭晓前隐藏</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};