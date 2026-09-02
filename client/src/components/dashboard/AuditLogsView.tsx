'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Search, Terminal } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const sampleLogs = [
    {
      id: '1',
      timestamp: '2026-09-02 21:40:12',
      level: 'INFO',
      source: 'WorkerPool',
      message: '⚡ [Worker Process] Initialized BullMQ Task Worker with concurrency = 5',
    },
    {
      id: '2',
      timestamp: '2026-09-02 21:41:05',
      level: 'INFO',
      source: 'TaskService',
      message: '🔄 Processing Job #rp_9021 (Type: REPORT_GENERATION, Priority: 3)',
    },
    {
      id: '3',
      timestamp: '2026-09-02 21:41:06',
      level: 'INFO',
      source: 'SocketEngine',
      message: '📊 Broadcasted `job:progress` event over Socket.IO -> Progress: 50%',
    },
    {
      id: '4',
      timestamp: '2026-09-02 21:41:08',
      level: 'INFO',
      source: 'TaskService',
      message: '✅ Job #rp_9021 COMPLETED in 2.4s — Result stored in PostgreSQL database',
    },
    {
      id: '5',
      timestamp: '2026-09-02 21:42:15',
      level: 'WARN',
      source: 'WorkerPool',
      message: '⚠️ Task #rp_7812 rate limit threshold warning: 85% queue capacity',
    },
    {
      id: '6',
      timestamp: '2026-09-02 21:43:01',
      level: 'ERROR',
      source: 'TaskProcessor',
      message: '❌ Job #rp_4412 FAILED: Connection timeout connecting to target host',
    },
  ];

  const filteredLogs = sampleLogs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesSearch =
      !searchTerm ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Terminal className="h-5 w-5 text-zinc-900" />
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-600 uppercase tracking-wider">AUDIT TRAIL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            System & Worker Audit Logs
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Searchable real-time execution stream, stack trace captures, and worker event history.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-1.5">
          {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-mono font-bold transition-all ${
                filterLevel === level
                  ? 'bg-zinc-900 text-white font-bold shadow-sm'
                  : 'bg-zinc-50 text-zinc-700 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm font-mono text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
        </div>
      </div>

      {/* Log Console Terminal View */}
      <div className="rounded-xl border border-zinc-800 bg-[#09090B] p-5 font-mono text-xs sm:text-sm space-y-3 shadow-xl">
        {filteredLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 border-b border-zinc-800/80 pb-3 last:border-0 last:pb-0">
            <span className="text-zinc-500 shrink-0 text-xs sm:text-sm">{log.timestamp}</span>

            <span
              className={`px-2 py-0.5 rounded text-xs font-bold shrink-0 ${
                log.level === 'INFO'
                  ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                  : log.level === 'WARN'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {log.level}
            </span>

            <span className="text-zinc-400 font-bold shrink-0">[{log.source}]</span>

            <span className="text-zinc-200 break-all">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
