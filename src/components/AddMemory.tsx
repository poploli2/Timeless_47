import React, { useState } from 'react';
import { Memory, Mood } from '../types';
import { Wand2, Loader2, Save, Image as ImageIcon, X } from 'lucide-react';
import { polishMemoryContent } from "../services/aiService";
import { uploadImage, compressImage } from "../services/uploadService";

interface AddMemoryProps {
  onAdd: (memory: Memory) => void;
  onCancel: () => void;
}

export const AddMemory: React.FC<AddMemoryProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.HAPPY);
  const [isPolishing, setIsPolishing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePolish = async () => {
    if (!content.trim()) return;
    setIsPolishing(true);
    const polished = await polishMemoryContent(content, mood);
    setContent(polished);
    setIsPolishing(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsUploading(true);

    let imageUrl: string | undefined = undefined;

    if (imageFile) {
      const compressed = await compressImage(imageFile);
      const url = await uploadImage(compressed);
      if (url) {
        imageUrl = url;
      }
    }

    const newMemory: Memory = {
      id: Date.now().toString(),
      title,
      date,
      content,
      location,
      mood,
      imageUrl
    };

    setIsUploading(false);
    onAdd(newMemory);
  };

  return (
    <div className="px-6 pb-24 max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center mb-8">
        <button
          onClick={onCancel}
          className="mr-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
        >
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          记录美好
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 标题 */}
        <div className="animate-slide-in-right group">
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-2xl bg-white border-0 shadow-sm text-lg font-bold text-slate-800 p-5 focus:ring-2 focus:ring-love-200 transition-all duration-300 placeholder-slate-300"
            placeholder="给这段回忆起个名字..."
            required
          />
        </div>

        {/* 日期和心情 */}
        <div className="grid grid-cols-2 gap-5 animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl bg-white border-0 shadow-sm text-sm font-medium text-slate-700 p-4 focus:ring-2 focus:ring-love-200 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">心情</label>
            <div className="relative">
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as Mood)}
                className="w-full rounded-2xl bg-white border-0 shadow-sm text-sm font-medium text-slate-700 p-4 focus:ring-2 focus:ring-love-200 transition-all duration-300 appearance-none cursor-pointer"
              >
                {Object.values(Mood).map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <span className="text-xs">▼</span>
              </div>
            </div>
          </div>
        </div>

        {/* 地点 */}
        <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">
            地点 <span className="text-slate-300 font-normal normal-case">(可选)</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-2xl bg-white border-0 shadow-sm text-sm font-medium text-slate-700 p-4 focus:ring-2 focus:ring-love-200 transition-all duration-300 placeholder-slate-300"
            placeholder="在哪里发生的？"
          />
        </div>

        {/* 图片上传 */}
        <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">
            照片 <span className="text-slate-300 font-normal normal-case">(可选)</span>
          </label>

          {!imagePreview ? (
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer bg-slate-50 hover:bg-white hover:border-love-300 hover:shadow-md transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-love-50/0 to-love-50/0 group-hover:from-love-50/50 group-hover:to-rose-50/50 transition-all duration-500"></div>
              <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <ImageIcon className="w-6 h-6 text-love-400" />
                </div>
                <p className="text-sm text-slate-500 font-bold group-hover:text-love-500 transition-colors">点击上传照片</p>
                <p className="text-xs text-slate-400 mt-1">支持 PNG, JPG</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
            </label>
          ) : (
            <div className="relative group rounded-3xl overflow-hidden shadow-md">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 p-2 bg-white/90 text-slate-700 rounded-full hover:bg-red-50 hover:text-red-500 shadow-lg hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">故事详情</label>
            <button
              type="button"
              onClick={handlePolish}
              disabled={isPolishing || !content}
              className="text-xs flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-love-50 text-love-600 hover:bg-love-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all duration-200"
            >
              {isPolishing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
              <span>AI 润色</span>
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full rounded-3xl bg-white border-0 shadow-sm text-base text-slate-600 p-5 focus:ring-2 focus:ring-love-200 transition-all duration-300 resize-none placeholder-slate-300 leading-relaxed"
            placeholder="记录下今天发生的事情，留住这份美好..."
            required
          />
        </div>

        {/* 操作按钮 */}
        <div className="pt-6 flex space-x-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 px-6 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 transition-all duration-200"
            disabled={isUploading}
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-[2] py-4 px-6 bg-gradient-to-r from-love-500 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-love-500/30 hover:shadow-love-500/50 hover:scale-[1.02] transition-all duration-200 flex justify-center items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>保存回忆</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
