import { useState, useRef, useEffect } from 'react';
import { AmanviBrain } from '../utils/AmanviBrain';
import { Mic, Send, Command } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AmanviSecretary() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Amanvi',
      text: 'Hi! I am Amanvi, your personal AI. Nenu active ga unnanu. Emi cheyali ivvala?',
    }
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('https://amanvi-ai.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'ashish@amanvi.ai', // Default email
          message: userMessage.text
        }),
      });

      const data = await response.json();
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Amanvi',
        text: data.reply || "Done.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'Amanvi',
        text: "Sorry, I am having trouble connecting to my Brain right now.",
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col pb-32">
      <div className="flex-1 overflow-y-auto mb-6 space-y-8 pr-2 pt-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.sender === 'You' ? (
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">YOU</span>
                <div className="bg-[#F4F4F5] text-gray-800 rounded-3xl rounded-tr-sm px-6 py-4 max-w-[80%] text-[15px] leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 items-start">
                <span className="text-[11px] font-bold text-[#8E5E67] uppercase tracking-widest px-2">AMANVI</span>
                <div className="bg-gradient-to-br from-[#faebeb] to-[#fcf3f4] border border-[#f0e1e2] text-gray-900 rounded-3xl rounded-tl-sm px-6 py-4 max-w-[85%] shadow-sm text-[15px] leading-relaxed">
                  {msg.text}
                </div>
                {msg.draft && (
                  <div className="bg-white border-2 border-dashed border-gray-200 p-5 rounded-2xl mt-2 max-w-[85%] w-full shadow-sm">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">DRAFT MESSAGE</span>
                    <p className="text-gray-700 italic text-sm">{msg.draft}</p>
                    <div className="flex gap-2 mt-4">
                      <button className="bg-black text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wide hover:shadow-md transition-all">APPROVE & SEND</button>
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide hover:bg-gray-200 transition-all">EDIT</button>
                    </div>
                  </div>
                )}
                {msg.action && !msg.draft && (
                  <button className="bg-black text-white px-6 py-3 rounded-xl text-xs font-semibold tracking-wide mt-2 flex items-center gap-2 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <Command className="w-3 h-3" />
                    {msg.action}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative mt-auto pb-4">
        {/* Glow effect behind the input */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-100/60 via-pink-50/50 to-orange-50/60 blur-2xl rounded-full scale-105 translate-y-2 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="absolute inset-y-0 left-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
              <Mic className="w-4 h-4" />
            </div>
          </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell Amanvi what to do..."
          className="w-full bg-white border-2 border-rose-50 shadow-sm rounded-full py-5 pl-16 pr-32 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-rose-50 focus:border-rose-200 transition-all text-sm font-medium"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
          <button 
            onClick={handleSend}
            className="bg-[#602835] hover:bg-[#4d202a] text-white p-3 px-6 rounded-full font-bold text-xs tracking-wider transition-all shadow-sm"
          >
            SEND
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
