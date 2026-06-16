import { useState, useRef, useEffect } from 'react';
import { AmanviBrain } from '../utils/AmanviBrain';
import { Mic, Send, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { LocalNotifications } from '@capacitor/local-notifications';

export default function AmanviSecretary() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('amanvi_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    return [
      {
        id: '1',
        sender: 'Amanvi',
        text: 'Hi! I am Amanvi, your personal AI. how can i help you?',
      }
    ];
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('amanvi_chat_history', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let receivedListener;
    
    const setupListeners = async () => {
      receivedListener = await LocalNotifications.addListener('localNotificationReceived', (notification) => {
        // Only trigger chat message for reminders, not the instant confirmation
        if (notification.title && notification.title.includes('Reminder')) {
          setMessages(prev => {
            const eventName = notification.title.replace('Amanvi AI Reminder: ', '');
            // Check if we already just sent this to avoid duplicates
            if (prev.length > 0 && prev[prev.length - 1].text.includes(eventName)) {
              return prev;
            }
            const newMsg = {
              id: Date.now().toString(),
              sender: 'Amanvi',
              text: `Ashish, Time aindi! It's time for your scheduled event: ${eventName}. 🚀`,
            };
            const updated = [...prev, newMsg];
            localStorage.setItem('amanvi_chat_history', JSON.stringify(updated));
            return updated;
          });
        }
      });
    };

    setupListeners();

    return () => {
      if (receivedListener) {
        receivedListener.remove();
      }
    };
  }, []);

  useEffect(() => {
    const handleNavigate = (e) => {
      if (e.detail) {
        setInput(e.detail);
        // Optional: you could also auto-send it by calling handleSend() 
        // but letting the user see and edit the time is better!
      }
    };
    window.addEventListener('AMANVI_NAVIGATE_CHAT', handleNavigate);
    return () => window.removeEventListener('AMANVI_NAVIGATE_CHAT', handleNavigate);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Directly hit n8n webhook to bypass broken backend
      const response = await fetch('https://unzip-trance-backup.ngrok-free.dev/webhook-test/amanvi-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          email: 'ashish@amanvi.ai', // Default email
          message: userMessage.text
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (e) {
        data = await response.text();
      }
      
      if (!response.ok) {
        throw new Error("Failed to communicate with API");
      }
      
      // Parse n8n specific response format (often an array or object with 'output')
      let replyText = "Done.";
      if (Array.isArray(data) && data.length > 0) {
        replyText = data[0].output || data[0].text || data[0].reply || JSON.stringify(data[0]);
      } else if (data && typeof data === 'object') {
        replyText = data.output || data.text || data.reply || JSON.stringify(data);
      } else if (typeof data === 'string') {
        replyText = data;
      }
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'Amanvi',
        text: replyText,
      };
      setMessages((prev) => [...prev, aiMessage]);

      // If the reply mentions scheduling, show an immediate confirmation notification
      if (replyText.toLowerCase().includes("schedul") || replyText.toLowerCase().includes("calendar") || replyText.toLowerCase().includes("book")) {
        try {
          await LocalNotifications.schedule({
            notifications: [{
              title: "Amanvi AI",
              body: "Your new schedule has been confirmed! 📅",
              id: Math.floor(Math.random() * 100000),
              schedule: { at: new Date(Date.now() + 2000) }, // 2 seconds later
              actionTypeId: "",
              extra: null
            }]
          });
        } catch (e) {
          console.warn("Failed to send immediate notification", e);
        }
      }
    } catch (error) {
      console.warn("API/n8n chat failed. Falling back to local AmanviBrain:", error);
      
      // Fallback to local AmanviBrain
      const fallbackData = AmanviBrain.processInput(userMessage.text);
      
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'Amanvi',
        text: fallbackData.text,
        draft: fallbackData.draft,
        action: fallbackData.action
      }]);
    } finally {
      setIsLoading(false);
      
      // Quietly fetch schedules and update all background alarms so reminders work without opening the Schedule tab
      try {
        const schedRes = await fetch('https://unzip-trance-backup.ngrok-free.dev/webhook-test/get-schedule');
        const data = await schedRes.json();
        const events = Array.isArray(data) ? data : (data.items || []);
        
        const pending = await LocalNotifications.getPending();
        if (pending.notifications && pending.notifications.length > 0) {
          await LocalNotifications.cancel(pending);
        }
        
        for (const event of events) {
          const startTimeStr = event.start?.dateTime || event.start?.date;
          if (!startTimeStr) continue;
          
          const startTime = new Date(startTimeStr);
          if (startTime > new Date()) {
            await LocalNotifications.schedule({
              notifications: [{
                title: `Amanvi AI Reminder: ${event.summary || 'Scheduled Event'}`,
                body: "It's time for your event!",
                id: Math.floor(Math.random() * 100000),
                schedule: { at: startTime },
                actionTypeId: "",
                extra: null
              }]
            });
          }
        }
      } catch (e) {
        console.warn("Background schedule sync failed:", e);
      }
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
        {isLoading && (
          <div className="flex flex-col gap-2 items-start">
            <span className="text-[11px] font-bold text-[#8E5E67] uppercase tracking-widest px-2">AMANVI</span>
            <div className="bg-gradient-to-br from-[#faebeb] to-[#fcf3f4] border border-[#f0e1e2] rounded-3xl rounded-tl-sm px-6 py-5 shadow-sm flex items-center gap-1.5">
              <motion.div className="w-2 h-2 bg-rose-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
              <motion.div className="w-2 h-2 bg-rose-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
              <motion.div className="w-2 h-2 bg-rose-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
            </div>
          </div>
        )}
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
            disabled={isLoading}
            className={`${isLoading ? 'bg-gray-400' : 'bg-[#602835] hover:bg-[#4d202a]'} text-white p-3 px-6 rounded-full font-bold text-xs tracking-wider transition-all shadow-sm`}
          >
            {isLoading ? 'WAIT...' : 'SEND'}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
