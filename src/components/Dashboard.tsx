import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Terminal as TerminalIcon,
  Clock,
  Database
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Language, Telemetry, LogEntry } from '../types';
import { TRANSLATIONS } from '../constants';

const data = [
  { time: '00:00', tokens: 400 },
  { time: '04:00', tokens: 300 },
  { time: '08:00', tokens: 600 },
  { time: '12:00', tokens: 800 },
  { time: '16:00', tokens: 500 },
  { time: '20:00', tokens: 900 },
  { time: '23:59', tokens: 700 },
];

interface DashboardProps {
  language: Language;
  telemetry: Telemetry;
  logs: LogEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ language, telemetry, logs }) => {
  const t = TRANSLATIONS[language];

  const stats = [
    { label: t.activeJobs, value: telemetry.activeJobs, icon: Activity, color: 'text-blue-500' },
    { label: t.tokenUsage, value: telemetry.tokenUsage.toLocaleString(), icon: Database, color: 'text-purple-500' },
    { label: t.avgLatency, value: `${telemetry.avgLatency}ms`, icon: Clock, color: 'text-orange-500' },
    { label: t.providerHealth, value: telemetry.providerHealth.toUpperCase(), icon: ShieldCheck, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">{t.dashboard}</h1>
        <p className="text-text/60 max-w-2xl">Real-time telemetry and system health monitoring for the Artistic MDRI Flow System.</p>
      </header>

      {/* Telemetry Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-secondary/50 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold uppercase tracking-wider opacity-50 mb-1">{stat.label}</span>
              <span className="text-2xl font-black">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 bg-card p-8 rounded-3xl border border-border shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Token Consumption (24h)
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">LIVE</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: 'var(--text)', opacity: 0.5, fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text)', opacity: 0.5, fontSize: 12}} />
                <Tooltip 
                  contentStyle={{backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px'}}
                  itemStyle={{color: 'var(--primary)', fontWeight: 'bold'}}
                />
                <Area type="monotone" dataKey="tokens" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorTokens)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Log Terminal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl border border-border shadow-sm flex flex-col overflow-hidden"
        >
          <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TerminalIcon className="w-5 h-5" />
              {t.liveLog}
            </h3>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 bg-slate-950 text-slate-300">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-2">
                <span className="opacity-40">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={`font-bold uppercase ${
                  log.level === 'error' ? 'text-red-400' : 
                  log.level === 'warn' ? 'text-yellow-400' : 
                  log.level === 'success' ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {log.level}
                </span>
                <span className="break-all">{log.message}</span>
              </div>
            ))}
            {logs.length === 0 && <div className="opacity-30 italic">Waiting for system events...</div>}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
