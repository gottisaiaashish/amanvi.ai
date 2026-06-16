import { useState, useEffect } from 'react';
import { Mail, MessageCircle, MessageSquare, Reply, Loader2 } from 'lucide-react';

export default function UnifiedInbox() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Fetch real data from local backend
        const response = await fetch('http://localhost:5000/api/inbox');
        const data = await response.json();
        
        const formattedMessages = data.map((msg) => {
          let color = 'bg-blue-50';
          let text = 'text-blue-700';
          let border = 'border-blue-100';

          if (msg.urgency === 'high') { color = 'bg-rose-50'; text = 'text-rose-700'; border = 'border-rose-100'; }
          else { color = 'bg-emerald-50'; text = 'text-emerald-700'; border = 'border-emerald-100'; }
          
          return {
            id: msg.id,
            source: msg.urgency === 'high' ? 'Urgent Note' : 'Message',
            sender: msg.sender,
            preview: `"${msg.message}"`,
            time: new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            color,
            text,
            border,
            aiSummary: msg.urgency === 'high' ? `Amanvi marked this as urgent for your attention.` : `Amanvi saved this message for you.`,
            actions: ['MARK DONE', 'REPLY']
          };
        });

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Unified Inbox</h1>
          <p className="text-gray-500 font-light">Amanvi is prioritizing <span className="font-semibold text-gray-900">3 new items</span> from your feeds.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {['Priority', 'All', 'Archived'].map((tab, i) => (
            <button key={tab} className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${i === 0 ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-rose-300" />
            <p>Amanvi is fetching your messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <MessageSquare className="w-8 h-8 mb-4 text-gray-300" />
            <p>You're all caught up! No new messages.</p>
          </div>
        ) : (
          messages.map((msg) => (
          <div key={msg.id} className="flex flex-col md:flex-row gap-4 md:gap-8 group">
            <div className="md:w-24 shrink-0 pt-4">
              <span className="text-sm font-semibold text-gray-900 block">{msg.time}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 block ${msg.text}`}>
                {msg.source}
              </span>
            </div>
            
            <div className={`flex-1 rounded-3xl border p-6 transition-all hover:shadow-md ${msg.color} ${msg.border}`}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">{msg.sender}</h3>
              </div>
              <p className="text-gray-700 text-sm mb-6 font-light leading-relaxed">
                {msg.preview}
              </p>

              <div className="bg-white/60 border border-white/40 rounded-2xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/10" />
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest block mb-1">Amanvi Insight</span>
                <p className="text-sm text-gray-800 font-medium">
                  {msg.aiSummary}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {msg.actions.map((action, idx) => (
                    <button key={idx} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                      idx === 0 
                        ? 'bg-white text-gray-900 hover:shadow-md' 
                        : 'bg-transparent text-gray-700 border border-black/10 hover:bg-black/5'
                    }`}>
                      {action}
                    </button>
                  ))}
                </div>
                <button className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 hover:bg-black/5 rounded-xl transition-colors">
                  DONE
                </button>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}