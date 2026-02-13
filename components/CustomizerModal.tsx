import React, { useState } from 'react';
import { MessageRequest } from '../types';
import { Loader2, Sparkles, X } from 'lucide-react';

interface CustomizerModalProps {
  onClose: () => void;
  onGenerate: (request: MessageRequest) => void;
  isGenerating: boolean;
}

const CustomizerModal: React.FC<CustomizerModalProps> = ({ onClose, onGenerate, isGenerating }) => {
  const [recipient, setRecipient] = useState('');
  const [tone, setTone] = useState<MessageRequest['tone']>('romantic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ recipient, tone });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative animate-in fade-in zoom-in duration-300">
        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
            <X size={20} />
        </button>
        
        <h2 className="text-2xl font-['Playfair_Display'] font-bold text-red-600 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Customize Letter
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
                <input 
                    type="text" 
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. My Sweetheart"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                    {(['romantic', 'funny', 'poetic', 'friendly'] as const).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTone(t)}
                            className={`px-3 py-2 text-sm rounded-lg capitalize transition-colors ${
                                tone === t 
                                ? 'bg-red-500 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isGenerating}
                className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Writing...
                    </>
                ) : (
                    "Write with AI"
                )}
            </button>
        </form>
      </div>
    </div>
  );
};

export default CustomizerModal;