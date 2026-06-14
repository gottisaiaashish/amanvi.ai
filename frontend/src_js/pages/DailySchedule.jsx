import { CheckCircle2, MoreHorizontal, Video } from "lucide-react";

export default function DailySchedule() {
  const schedule = [
    {
      time: "09:00 AM",
      type: "focus",
      title: "Deep Work: System Architecture",
      duration: "2h",
      color: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-100",
    },
    {
      time: "11:30 AM",
      type: "call",
      title: "Series A Pitch with Sequoia",
      duration: "45m",
      color: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-100",
      participants: ["S"],
    },
    {
      time: "02:00 PM",
      type: "task",
      title: "Review n8n webhook logs",
      duration: "30m",
      color: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
    },
    {
      time: "04:00 PM",
      type: "meeting",
      title: "Design Sync",
      duration: "1h",
      color: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-100",
      participants: ["D", "A"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          Today's Schedule
        </h1>
        <p className="text-gray-500">October 24, 2026</p>
      </header>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-3xl p-6 mb-10 shadow-xl flex gap-4 items-start relative overflow-hidden">
        <div>
          <h3 className="font-semibold text-lg mb-1">Amanvi's Briefing</h3>
          <p className="text-gray-300 text-sm leading-relaxed max-w-xl font-light">
            Your day is front-loaded with deep work. I've automatically pushed
            your internal design sync to the afternoon so you can fully prepare
            for the Sequoia pitch at 11:30 AM.
          </p>
        </div>
      </div>

      {/* Modern Agenda List */}
      <div className="space-y-6">
        {schedule.map((item, i) => (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 md:gap-8 group"
          >
            <div className="md:w-24 shrink-0 pt-4">
              <span className="text-sm font-semibold text-gray-900">
                {item.time}
              </span>
              <p className="text-xs text-gray-400 font-medium">
                {item.duration}
              </p>
            </div>

            <div
              className={`flex-1 rounded-3xl border p-6 transition-all hover:shadow-md ${item.color} ${item.border}`}
            >
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/60 ${item.text}`}
                >
                  {item.type}
                </span>
                <button className="text-gray-400 hover:text-gray-900 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                {item.title}
              </h3>

              <div className="flex justify-between items-center">
                <div className="flex -space-x-2">
                  {item.participants?.map((p, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-white border-2 border-transparent shadow-sm flex items-center justify-center text-xs font-bold text-gray-700"
                    >
                      {p}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {item.type === "call" || item.type === "meeting" ? (
                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 shadow-sm hover:shadow transition-all">
                      <Video className="w-4 h-4" /> Join
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-semibold text-gray-900 shadow-sm hover:shadow transition-all">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
