import { useState, useRef, useEffect } from "react";
import { AmanviBrain } from "../utils/AmanviBrain";

export default function AmanviSecretary() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "Amanvi",
      text: "Hi Ashish! ❤️ Nenu ochesanu. Emi chestunnav ivvala?",
    },
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: "You",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI thinking delay for a human feel
    setTimeout(() => {
      const response = AmanviBrain.processInput(userMessage.text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "Amanvi",
        text: response.text,
        draft: response.draft,
        action: response.action,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 600); // 600ms delay feels natural
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto min-h-[calc(100vh-80px)] flex flex-col">
      {/* Chat / Command Flow Area */}
      <div className="flex-1 pb-10 pt-6 px-4 md:px-8 space-y-8">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.sender === "You" ? (
              <div className="flex flex-col gap-2 items-end">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-900/40 pr-2">
                  You
                </span>
                <div className="bg-white border border-rose-100/60 px-6 py-4 rounded-3xl rounded-tr-md shadow-[0_4px_20px_rgb(0,0,0,0.02)] max-w-lg">
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">
                    {msg.text}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 items-start mt-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-rose-900/40 pl-2">
                  Amanvi
                </span>

                <div className="bg-rose-50/50 backdrop-blur-sm border border-rose-100/50 px-6 py-6 rounded-3xl rounded-tl-md shadow-sm max-w-xl">
                  <p className="text-gray-800 font-medium text-sm leading-relaxed">
                    {msg.text}
                  </p>

                  {msg.draft && (
                    <div className="bg-white/80 border border-white rounded-2xl p-4 mt-5 shadow-sm">
                      <span className="text-[9px] font-bold text-rose-800/60 uppercase tracking-widest block mb-2">
                        Drafted Reply
                      </span>
                      <p className="font-medium text-gray-900 text-sm leading-relaxed italic">
                        "{msg.draft}"
                      </p>
                    </div>
                  )}

                  {msg.action && (
                    <div className="flex flex-wrap gap-2 mt-5">
                      <button className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all bg-gradient-to-r from-rose-900 to-rose-950 text-white hover:opacity-90 shadow-sm">
                        {msg.action}
                      </button>
                      <button className="px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all bg-white text-rose-900 border border-rose-100 hover:bg-rose-50">
                        EDIT
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Locked Bottom Input Area */}
      <div className="sticky bottom-20 md:bottom-6 mt-auto w-full px-4 md:px-8 z-10">
        <div className="bg-white/80 backdrop-blur-2xl border border-rose-100/80 shadow-[0_8px_40px_rgb(225,29,72,0.06)] rounded-[2rem] p-2 flex items-center transition-all focus-within:bg-white focus-within:shadow-[0_8px_50px_rgb(225,29,72,0.1)] focus-within:border-rose-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell Amanvi what to do..."
            className="flex-1 bg-transparent py-4 pl-6 text-sm font-medium text-gray-800 placeholder:text-rose-900/30 placeholder:font-light focus:outline-none"
          />

          <button
            onClick={handleSend}
            className="ml-2 px-8 py-4 bg-gradient-to-r from-rose-900 to-rose-950 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-3xl hover:opacity-90 transition-opacity shadow-md shrink-0"
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
