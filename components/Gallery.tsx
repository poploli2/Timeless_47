import React, { useState } from 'react';
import { Memory } from '../types';
import { X, Calendar, MapPin } from 'lucide-react';

interface GalleryProps {
  memories: Memory[];
}

export const Gallery: React.FC<GalleryProps> = ({ memories }) => {
  const [selectedImage, setSelectedImage] = useState<Memory | null>(null);

  // Filter memories that have an image URL
  const photos = memories.filter(m => m.imageUrl && m.imageUrl.trim() !== '');

  return (
    <div className="px-4 py-6 pb-24 max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6 pl-2">
        <h2 className="text-2xl font-bold text-love-800">Our Gallery</h2>
        <p className="text-sm text-gray-500">Snapshots of our beautiful moments.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {photos.map((memory) => (
          <div 
            key={memory.id} 
            onClick={() => setSelectedImage(memory)}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm bg-gray-100"
          >
            <img 
              src={memory.imageUrl} 
              alt={memory.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
               <p className="text-white text-xs font-bold truncate">{memory.title}</p>
               <p className="text-white/80 text-[10px]">{new Date(memory.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
         <div className="text-center py-16 bg-white rounded-2xl border-dashed border-2 border-gray-200">
           <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
             <Calendar size={32} />
           </div>
           <p className="text-gray-500 font-medium">No photos yet</p>
           <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">Create a new memory and add a photo URL to see it appear here.</p>
         </div>
      )}

      {/* Lightbox Overlay */}
      {selectedImage && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedImage(null)}>
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>
          
          <div className="max-w-xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
             <div className="relative">
                <img 
                  src={selectedImage.imageUrl} 
                  alt={selectedImage.title} 
                  className="w-full max-h-[60vh] object-cover bg-gray-100" 
                />
             </div>
             <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{selectedImage.title}</h3>
                    <div className="flex items-center text-gray-500 text-xs mt-1 space-x-3">
                      <span className="flex items-center"><Calendar size={12} className="mr-1"/> {new Date(selectedImage.date).toLocaleDateString(undefined, {dateStyle: 'long'})}</span>
                      {selectedImage.location && (
                        <span className="flex items-center"><MapPin size={12} className="mr-1"/> {selectedImage.location}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-love-50 text-love-600 px-3 py-1 rounded-full border border-love-100">
                    {selectedImage.mood}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedImage.content}
                </p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};