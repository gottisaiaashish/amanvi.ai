export default function UnifiedInbox() {
  const messages = [
    {
      id: 1,
      source: "WhatsApp",
      sender: "Rahul (Client)",
      preview:
        '"Can we schedule the call for 5 PM instead? I am stuck in traffic."',
      time: "10:30 AM",
      color: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
      aiSummary: "Requested to reschedule today's call to 5:00 PM.",
      actions: ["RESCHEDULE TO 5 PM", "REPLY"],
    },
    {
      id: 2,
      source: "Gmail",
      sender: "investors@vc.com",
      preview:
        '"We reviewed the Series A Pitch Deck. Let\'s discuss the financial projections on Thursday."',
      time: "09:15 AM",
      color: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-100",
      aiSummary:
        "Investors want to discuss financial projections this Thursday.",
      actions: ["SCHEDULE FOR THURSDAY", "ACKNOWLEDGE"],
    },
    {
      id: 3,
      source: "Instagram",
      sender: "@design_agency",
      preview:
        '"We loved the new UI you posted, let us collaborate on a project!"',
      time: "08:45 AM",
      color: "bg-fuchsia-50",
      text: "text-fuchsia-700",
      border: "border-fuchsia-100",
      aiSummary: "Potential collaboration lead from a design agency.",
      actions: ["DRAFT REPLY"],
    },
    {
      id: 4,
      source: "Calendar",
      sender: "Google Calendar",
      preview: "Upcoming: Board Meeting in 15 mins. (Zoom link attached)",
      time: "08:00 AM",
      color: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-100",
      aiSummary: "Board meeting starting very soon.",
      actions: ["JOIN ZOOM"],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-8 md:p-12 pb-32">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Unified Inbox
          </h1>
          <p className="text-gray-500 font-light">
            Amanvi is prioritizing{" "}
            <span className="font-semibold text-gray-900">4 new items</span>{" "}
            from your feeds.
          </p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          {["Priority", "All", "Archived"].map((tab, i) => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${i === 0 ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex flex-col md:flex-row gap-4 md:gap-8 group"
          >
            {/* Left Column: Time & Source */}
            <div className="md:w-24 shrink-0 pt-4">
              <span className="text-sm font-semibold text-gray-900 block">
                {msg.time}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest mt-1 block ${msg.text}`}
              >
                {msg.source}
              </span>
            </div>

            {/* Right Column: Colored Message Block */}
            <div
              className={`flex-1 rounded-3xl border p-6 transition-all hover:shadow-md ${msg.color} ${msg.border}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  {msg.sender}
                </h3>
              </div>

              <p className="text-gray-700 text-sm mb-6 font-light leading-relaxed">
                {msg.preview}
              </p>

              {/* AI Insight Box inside the block */}
              <div className="bg-white/60 border border-white/40 rounded-2xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/10" />
                <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest block mb-1">
                  Amanvi Insight
                </span>
                <p className="text-sm text-gray-800 font-medium">
                  {msg.aiSummary}
                </p>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {msg.actions.map((action, idx) => (
                    <button
                      key={idx}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-sm ${
                        idx === 0
                          ? "bg-white text-gray-900 hover:shadow-md"
                          : "bg-transparent text-gray-700 border border-black/10 hover:bg-black/5"
                      }`}
                    >
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
        ))}
      </div>
    </div>
  );
}
