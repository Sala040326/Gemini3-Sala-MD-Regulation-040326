import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Workflow, 
  Settings, 
  Terminal, 
  Activity, 
  Cpu, 
  Globe, 
  Palette, 
  Zap,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Language, Theme, PantoneStyle } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  theme: Theme;
  currentStyle: PantoneStyle;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  language, 
  theme, 
  currentStyle 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const t = TRANSLATIONS[language];

  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'mdri', icon: Workflow, label: t.mdri },
    { id: 'studio', icon: Cpu, label: t.studio },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <div className={`flex h-screen w-full overflow-hidden ${theme === 'dark' ? 'dark' : ''}`} data-style={currentStyle.id}>
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="h-full bg-card border-r border-border flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">MDRI FLOW</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'hover:bg-secondary text-text/70 hover:text-text'
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
              {activeTab === item.id && isSidebarOpen && (
                <motion.div layoutId="active-pill" className="ml-auto">
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className={`flex items-center gap-3 p-3 rounded-xl bg-secondary/50 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            {isSidebarOpen && (
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider opacity-50">System Status</span>
                <span className="text-sm font-medium">v2.1.0 Online</span>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-background relative">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
