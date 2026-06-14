import type { ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Inbox, Calendar, MessageSquare, Settings, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { name: 'Inbox', path: '/', icon: Inbox },
  { name: 'Schedule', path: '/schedule', icon: Calendar },
  { name: 'Amanvi AI', path: '/amanvi', icon: MessageSquare },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function BrightLayout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#fafafa] text-gray-900 font-sans overflow-hidden">
      {/* Sleek Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight mb-8">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
              <Command className="w-4 h-4" />
            </div>
            Amanvi OS
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
                        ? 'bg-black text-white shadow-md' 
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
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

        <div className="mt-auto p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-200 to-rose-100 border-2 border-white shadow-sm flex items-center justify-center text-rose-600 font-bold">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Ashish Gotti</p>
              <p className="text-xs font-medium text-gray-400">Pro Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-white md:m-3 md:rounded-[2rem] shadow-[0_0_40px_rgba(0,0,0,0.03)] border border-gray-100">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
              <Command className="w-4 h-4" />
            </div>
            Amanvi OS
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-200 to-rose-100 flex items-center justify-center text-rose-600 font-bold">
            A
          </div>
        </header>

        {/* Page Content with AnimatePresence */}
        <div className="flex-1 overflow-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Mobile Nav */}
        <nav className="md:hidden absolute bottom-6 left-6 right-6 bg-black/90 backdrop-blur-xl text-white rounded-2xl p-2 flex justify-around shadow-2xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`p-3 rounded-xl transition-all ${
                  isActive ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            );
          })}
        </nav>

      </main>
    </div>
  );
}