import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, CheckCircle2, Sparkles, MoreHorizontal, Video, Loader2, Trash2, CalendarClock, Check } from 'lucide-react';

import { LocalNotifications } from '@capacitor/local-notifications';

export default function DailySchedule() {
  const navigate = useNavigate();
  const [allSchedules, setAllSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMenuId, setExpandedMenuId] = useState(null);

  const handleDeleteEvent = async (id) => {
    setAllSchedules(prev => prev.filter(item => item.id !== id));
    setExpandedMenuId(null);
    try {
      await fetch('https://unzip-trance-backup.ngrok-free.dev/webhook/delete-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ eventId: id })
      });
    } catch (e) {
      console.error("Failed to delete event", e);
    }
  };

  const handleMarkDone = (id) => {
    setAllSchedules(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isDone: true };
      }
      return item;
    }));
    setExpandedMenuId(null);
  };

  const handleReschedule = (title) => {
    // Navigate to Chat tab and dispatch event to pre-fill
    navigate('/amanvi');
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('AMANVI_NAVIGATE_CHAT', { detail: `Amanvi, reschedule ${title} to ` }));
    }, 300);
  };

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      try {
        await LocalNotifications.requestPermissions();
      } catch (e) {
        console.warn("Could not request notification permissions:", e);
      }
    };
    requestPermissions();

    const fetchTasks = async () => {
      try {
        // Fetch from n8n webhook directly!
        const response = await fetch('https://unzip-trance-backup.ngrok-free.dev/webhook/get-schedule', {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        const data = await response.json();
        
        const now = new Date();
        const formattedSchedule = [];

        // Parse n8n Google Calendar response (usually an array of items)
        const events = Array.isArray(data) ? data : (data.items || []);

        for (const event of events) {
          // Some events might just have dates (all-day), some have dateTime
          const startTimeStr = event.start?.dateTime || event.start?.date;
          if (!startTimeStr) continue;
          
          const startTime = new Date(startTimeStr);
          const title = event.summary || 'Untitled Event';
          const desc = event.description || '30m';

          let typeStr = 'task';
          let color = 'bg-emerald-50';
          let text = 'text-emerald-700';
          let border = 'border-emerald-100';

          if (title.toLowerCase().includes('call') || title.toLowerCase().includes('pitch')) {
            typeStr = 'call';
            color = 'bg-blue-50'; text = 'text-blue-700'; border = 'border-blue-100';
          } else if (title.toLowerCase().includes('sync') || title.toLowerCase().includes('meeting')) {
            typeStr = 'meeting';
            color = 'bg-orange-50'; text = 'text-orange-700'; border = 'border-orange-100';
          } else if (title.toLowerCase().includes('reminder') || title.toLowerCase().includes('water')) {
            typeStr = 'focus';
            color = 'bg-purple-50'; text = 'text-purple-700'; border = 'border-purple-100';
          }

          formattedSchedule.push({
            id: event.id || Math.random().toString(),
            fullDate: startTime,
            time: startTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            type: typeStr,
            title: title,
            duration: desc,
            color,
            text,
            border
          });

          // Schedule a native Android notification exactly when it starts!
          if (startTime > now) {
            try {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: `Amanvi AI: ${title}`,
                    body: "It's time for your scheduled event!",
                    id: Math.floor(Math.random() * 100000), // unique ID
                    schedule: { at: startTime },
                    actionTypeId: "",
                    extra: null
                  }
                ]
              });
            } catch (err) {
              console.warn("Could not schedule local notification", err);
            }
          }
        }

        // Sort chronologically across all dates
        formattedSchedule.sort((a, b) => a.fullDate - b.fullDate);

        setAllSchedules(formattedSchedule);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Filter schedules for the currently selected date
  const displayedSchedule = allSchedules.filter(item => {
    return item.fullDate.toDateString() === selectedDate.toDateString();
  });

  // Generate an array of 14 days starting from today for the Date Strip
  const datesStrip = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">My Schedule</h1>
        <p className="text-gray-500">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </header>

      {/* HORIZONTAL DATE STRIP */}
      <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-8 pb-4 -mx-8 px-8 md:mx-0 md:px-0">
        {datesStrip.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <button 
              key={i} 
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center min-w-[4.5rem] p-3 rounded-2xl transition-all ${
                isSelected 
                  ? 'bg-gray-900 text-white shadow-lg scale-105' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className={`text-xs font-semibold uppercase mb-1 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                {date.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {date.getDate()}
              </span>
            </button>
          )
        })}
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-3xl p-6 mb-10 shadow-xl flex gap-4 items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-24 h-24" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">Amanvi's Briefing</h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl font-light">
            Your day is front-loaded with deep work. I've automatically pushed your internal design sync to the afternoon so you can fully prepare for the Sequoia pitch at 11:30 AM.
          </p>
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="absolute left-[5.5rem] top-4 bottom-4 w-px bg-gray-100 z-0"></div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 relative z-10 bg-white">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-rose-300" />
            <p>Amanvi is fetching your schedule...</p>
          </div>
        ) : displayedSchedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 relative z-10 bg-white">
            <CheckCircle2 className="w-8 h-8 mb-4 text-gray-300" />
            <p>Your schedule is clear for this day!</p>
          </div>
        ) : (
          displayedSchedule.map((item, i) => (
          <div key={i} className={`flex gap-6 relative z-10 group cursor-pointer transition-all ${item.isDone ? 'opacity-50 grayscale' : ''}`}>
            <div className="w-20 pt-4 text-right shrink-0">
              <span className="text-sm font-semibold text-gray-900 block">{item.time.split(' ')[0]}</span>
              <span className="text-[10px] font-bold text-gray-400 block">{item.time.split(' ')[1]}</span>
            </div>

            <div className="pt-5 shrink-0">
              <div className={`w-3 h-3 rounded-full bg-white border-[3px] ${item.text.replace('text', 'border')} group-hover:scale-125 transition-transform`}></div>
            </div>

            <div className={`flex-1 rounded-3xl border p-5 relative ${item.color} ${item.border} transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start">
                <div className="pr-12">
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${item.text}`}>{item.type}</span>
                  <h3 className={`text-lg font-bold text-gray-900 mb-1 ${item.isDone ? 'line-through' : ''}`}>{item.title}</h3>
                  <p className="text-sm text-gray-600 font-medium">{item.duration}</p>
                </div>
                
                <div className="absolute top-4 right-4 z-20">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setExpandedMenuId(expandedMenuId === item.id ? null : item.id); }}
                    className="p-2 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                  
                  {expandedMenuId === item.id && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 origin-top-right z-30">
                      <button onClick={(e) => { e.stopPropagation(); handleMarkDone(item.id); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Mark as Done
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleReschedule(item.title); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <CalendarClock className="w-4 h-4" /> Reschedule
                      </button>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(item.id); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 className="w-4 h-4" /> Delete Event
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}