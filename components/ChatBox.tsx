
import React, { useState, useRef, useEffect } from 'react';
import { Send, Hash, Info, User, Shield, Sparkles } from 'lucide-react';
import { MASTERS } from '../constants';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Sensei Stone', text: 'Watching the footwork closely in this bout.', role: 'judge' },
    { id: 2, sender: 'DragonFan99', text: 'Ken is going to land that fire kick any second!', role: 'fan' },
    { id: 3, sender: 'Master Blaze', text: 'VFX quality has improved since last season.', role: 'judge' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'Alex',
      text: input,
      role: 'fan'
    }]);
    setInput('');

    // Mock judge response
    if (input.toLowerCase().includes('help') || input.toLowerCase().includes('tips')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'Elder Cipher',
          text: 'Remember, lighting consistency is the key to realistic composite shots.',
          role: 'judge'
        }]);
      }, 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl flex flex-col h-full min-h-[500px]">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <Hash size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm">JUDGES LOUNGE</h4>
            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-green-500">
               <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> 5 Masters Active
            </div>
          </div>
        </div>
        <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <Info size={18} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'judge' ? 'items-start' : 'items-end'}`}>
            <div className="flex items-center space-x-2 mb-1">
               {msg.role === 'judge' && <Shield size={12} className="text-orange-500" />}
               <span className={`text-[10px] font-black uppercase tracking-widest ${msg.role === 'judge' ? 'text-orange-500' : 'text-gray-400'}`}>
                 {msg.sender}
               </span>
            </div>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
              msg.role === 'judge' 
                ? 'bg-orange-50 dark:bg-orange-900/20 text-gray-800 dark:text-gray-200 rounded-tl-none border-l-4 border-orange-500' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tr-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSend} className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Send message to Masters..."
            className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="mt-3 text-[10px] text-gray-400 text-center flex items-center justify-center">
           <Sparkles size={10} className="mr-1" /> Use 'help' or 'tips' for AI-Sensei insights
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
