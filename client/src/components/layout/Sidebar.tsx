'use client';

import React from 'react';
import { LayoutDashboard, ListTodo, Activity, Terminal, Settings, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'dashboard', setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
    { id: 'tasks', label: 'Task Queue', icon: ListTodo, badge: 'Live' },
    { id: 'analytics', label: 'Engine Telemetry', icon: Activity, badge: null },
    { id: 'audit', label: 'Audit Logs', icon: Terminal, badge: null },
    { id: 'settings', label: 'System Config', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 bg-white p-5 hidden md:block min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3">
            Platform Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${
                        isActive ? 'bg-zinc-800 text-amber-400' : 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Worker Pool Telemetry Micro Card */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm font-bold text-zinc-900">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-zinc-800" />
              <span>Worker Pool</span>
            </div>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="space-y-1.5 text-xs font-mono text-zinc-600">
            <div className="flex justify-between">
              <span>Concurrency</span>
              <span className="text-zinc-900 font-bold">5 Threads</span>
            </div>
            <div className="flex justify-between">
              <span>Queue Transport</span>
              <span className="text-zinc-900 font-bold">Redis 7</span>
            </div>
            <div className="flex justify-between">
              <span>DB Persistence</span>
              <span className="text-zinc-900 font-bold">PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
