import { PhoneCall, CheckCircle2, Sparkles, MoreHorizontal, Video } from 'lucide-react';

export default function DailySchedule() {
  const schedule = [
    { time: '09:00 AM', type: 'focus', title: 'Deep Work: System Architecture', duration: '2h', color: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
    { time: '11:30 AM', type: 'call', title: 'Series A Pitch with Sequoia', duration: '45m', color: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', participants: ['S'] },
    { time: '02:00 PM', type: 'task', title: 'Review n8n webhook logs', duration: '30m', color: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
    { time: '04:00 PM', type: 'meeting', title: 'Design Sync', duration: '1h', color: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', participants: ['D', 'A'] },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Today's Schedule</h1>
        <p className="text-gray-500">October 24, 2026</p>
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
        {schedule.map((item, i) => (
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
        ))}
      </div>
    </div>
  );
}