import React, { useState } from 'react';
import { Milestone } from '../types';
import { Trash2, Plus, CalendarHeart } from 'lucide-react';

interface MilestoneManagerProps {
  milestones: Milestone[];
  onUpdate: (milestones: Milestone[]) => void;
}

export const MilestoneManager: React.FC<MilestoneManagerProps> = ({ milestones, onUpdate }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<Milestone['type']>('Anniversary');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    
    const newItem: Milestone = {
      id: Date.now().toString(),
      title: newTitle,
      date: newDate,
      type: newType
    };

    onUpdate([...milestones, newItem]);
    setNewTitle('');
    setNewDate('');
  };

  const handleDelete = (id: string) => {
    onUpdate(milestones.filter(m => m.id !== id));
  };

  return (
    <div className="mt-6 w-full max-w-xs">
      <div className="flex items-center space-x-2 mb-3">
        <CalendarHeart className="text-love-500" size={20} />
        <h3 className="font-bold text-love-800">Important Dates</h3>
      </div>

      {/* List */}
      <div className="space-y-2 mb-4">
        {milestones.map(m => (
          <div key={m.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100 group">
             <div>
               <p className="text-sm font-semibold text-gray-800">{m.title}</p>
               <p className="text-xs text-gray-500">{new Date(m.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
             </div>
             <button onClick={() => handleDelete(m.id)} className="text-gray-300 hover:text-red-400 transition-colors">
               <Trash2 size={16} />
             </button>
          </div>
        ))}
        {milestones.length === 0 && <p className="text-sm text-gray-400 italic text-center py-2">No dates added yet.</p>}
      </div>

      {/* Add Form */}
      <form onSubmit={handleAdd} className="bg-white p-3 rounded-xl border border-love-100 shadow-sm">
        <p className="text-xs font-semibold text-love-400 uppercase mb-2">Add New Date</p>
        <div className="space-y-2">
          <input 
            type="text" 
            placeholder="Event Name (e.g. First Kiss)" 
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full text-sm p-2 bg-gray-50 rounded-lg border-none focus:ring-1 focus:ring-love-300"
          />
          <input 
            type="date" 
            value={newDate}
            onChange={e => setNewDate(e.target.value)}
            className="w-full text-sm p-2 bg-gray-50 rounded-lg border-none focus:ring-1 focus:ring-love-300"
          />
          <div className="flex space-x-2">
            <select 
              value={newType}
              onChange={e => setNewType(e.target.value as any)}
              className="flex-1 text-sm p-2 bg-gray-50 rounded-lg border-none focus:ring-1 focus:ring-love-300"
            >
              <option value="Anniversary">Anniversary</option>
              <option value="Birthday">Birthday</option>
              <option value="Special">Special</option>
            </select>
            <button type="submit" className="bg-love-500 text-white p-2 rounded-lg hover:bg-love-600">
              <Plus size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};