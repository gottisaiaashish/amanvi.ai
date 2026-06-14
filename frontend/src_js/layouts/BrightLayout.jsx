import { NavLink, useLocation } from "react-router-dom";
import { Inbox, Calendar, MessageSquare, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "Inbox", path: "/", icon: Inbox },
  { name: "Schedule", path: "/schedule", icon: Calendar },
  { name: "Amanvi AI", path: "/amanvi", icon: MessageSquare },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function BrightLayout({ children }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#fafafa] text-gray-900 font-sans overflow-hidden">
      {/* Sleek Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-8">
            Amanvi AI
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm ${
                      isActive
                        ? "bg-gradient-to-r from-rose-100 to-fuchsia-50 text-rose-900 shadow-sm border border-rose-100/50"
                        : "text-gray-400 hover:bg-rose-50/50 hover:text-gray-700"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav (Fallback for smaller screens) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 p-3 flex justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 ${
                  isActive ? "text-black" : "text-gray-400"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
