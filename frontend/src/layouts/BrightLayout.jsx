import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Inbox, Calendar, MessageSquare, Settings, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExpandableTabs } from '../components/expandable-tabs';

const NAV_ITEMS = [
  { title: 'Inbox', path: '/', icon: Inbox },
  { title: 'Schedule', path: '/schedule', icon: Calendar },
  { title: 'Amanvi AI', path: '/amanvi', icon: MessageSquare },
  { title: 'Settings', path: '/settings', icon: Settings },
];

export default function BrightLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex h-[100dvh] bg-[#fafafa] text-gray-900 font-sans overflow-hidden">
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
                        ? 'bg-gradient-to-r from-[#e8cdcf] to-transparent text-[#91475A] font-medium' 
                        : 'text-gray-500 hover:bg-[#e8cdcf]/20 hover:text-[#91475A]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>
        </div>


      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col bg-white">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            Amanvi AI
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

        {/* Bottom Fade for Scroll */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-40 pointer-events-none"></div>

        {/* Floating Mobile Nav */}
        <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none px-4">
          <div className="pointer-events-auto">
            <ExpandableTabs
              tabs={NAV_ITEMS}
              className=""
              onChange={(index) => {
                if (index !== null && NAV_ITEMS[index]) {
                  navigate(NAV_ITEMS[index].path);
                }
              }}
            />
          </div>
        </div>

      </main>
    </div>
  );
}
