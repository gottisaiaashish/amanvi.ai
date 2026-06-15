import { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle2, Sparkles, MoreHorizontal, Video, Loader2 } from 'lucide-react';

import { LocalNotifications } from '@capacitor/local-notifications';

export default function DailySchedule() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        const response = await fetch('https://unzip-trance-backup.ngrok-free.dev/webhook-test/get-schedule');
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

        // Sort chronologically
        formattedSchedule.sort((a, b) => {
           const timeA = new Date(`1970/01/01 ${a.time}`);
           const timeB = new Date(`1970/01/01 ${b.time}`);
           return timeA - timeB;
        });

        setSchedule(formattedSchedule);
      } catch (error) {
        console.error("Failed to fetch schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Today's Schedule</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </header>

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
        ) : schedule.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 relative z-10 bg-white">
            <CheckCircle2 className="w-8 h-8 mb-4 text-gray-300" />
            <p>Your schedule is clear for today!</p>
          </div>
        ) : (
          schedule.map((item, i) => (
          <div key={i} className="flex gap-6 relative z-10 group cursor-pointer">
            <div className="w-20 pt-4 text-right shrink-0">
              <span className="text-sm font-semibold text-gray-900 block">{item.time.split(' ')[0]}</span>
              <span className="text-[10px] font-bold text-gray-400 block">{item.time.split(' ')[1]}</span>
            </div>

            <div className="pt-5 shrink-0">
              <div className={`w-3 h-3 rounded-full bg-white border-[3px] ${item.text.replace('text', 'border')} group-hover:scale-125 transition-transform`}></div>
            </div>

            <div className={`flex-1 rounded-3xl border p-5 ${item.color} ${item.border} transition-all hover:shadow-md`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${item.text}`}>{item.type}</span>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 font-medium">{item.duration}</p>
                </div>
                {item.participants && (
                  <div className="flex -space-x-2">
                    {item.participants.map((p, j) => (
                      <div key={j} className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                        {p}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}