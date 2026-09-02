'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Settings, Cpu, Database, CheckCircle2 } from 'lucide-react';

export const SystemConfigView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Settings className="h-5 w-5 text-zinc-900" />
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-600 uppercase tracking-wider">SYSTEM CONFIG</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Engine & Infrastructure Configuration
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            BullMQ queue parameters, Redis host connection strings, and system runtime parameters.
          </p>
        </div>
      </div>

      {/* Grid Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Worker Pool Config */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Cpu className="h-5 w-5 text-zinc-900" />
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base font-mono uppercase tracking-wider">Worker Concurrency Settings</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm font-mono">
            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div>
                <div className="font-bold text-zinc-900 text-sm">Max Worker Concurrency</div>
                <div className="text-xs text-zinc-500 font-sans mt-0.5">Parallel job processing threads</div>
              </div>
              <span className="font-bold text-zinc-900 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 text-xs sm:text-sm">
                5 Threads
              </span>
            </div>

            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div>
                <div className="font-bold text-zinc-900 text-sm">Retry Strategy</div>
                <div className="text-xs text-zinc-500 font-sans mt-0.5">Exponential backoff algorithm</div>
              </div>
              <span className="font-bold text-emerald-700 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 text-xs sm:text-sm">
                2x Exponential
              </span>
            </div>

            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div>
                <div className="font-bold text-zinc-900 text-sm">Max Retry Attempts</div>
                <div className="text-xs text-zinc-500 font-sans mt-0.5">Attempts before marking FAILED</div>
              </div>
              <span className="font-bold text-zinc-900 bg-white px-3 py-1.5 rounded-lg border border-zinc-200 text-xs sm:text-sm">
                3 Attempts
              </span>
            </div>
          </div>
        </Card>

        {/* Redis & Database Config */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
            <Database className="h-5 w-5 text-zinc-900" />
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base font-mono uppercase tracking-wider">Infrastructure Environment</h3>
          </div>

          <div className="space-y-4 text-xs sm:text-sm font-mono">
            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div>
                <div className="font-bold text-zinc-900 text-sm">Redis Connection</div>
                <div className="text-xs text-zinc-500 font-sans mt-0.5">BullMQ message transport</div>
              </div>
              <span className="font-bold text-zinc-900 text-xs sm:text-sm">localhost:6379</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div>
                <div className="font-bold text-zinc-900 text-sm">PostgreSQL Database</div>
                <div className="text-xs text-zinc-500 font-sans mt-0.5">Prisma ORM persistence</div>
              </div>
              <span className="font-bold text-emerald-600 flex items-center gap-1.5 text-xs sm:text-sm">
                <CheckCircle2 className="h-4 w-4" /> Connected
              </span>
            </div>

            <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div>
                <div className="font-bold text-zinc-900 text-sm">JWT Token Security</div>
                <div className="text-xs text-zinc-500 font-sans mt-0.5">Dual Access & Refresh Token Expiry</div>
              </div>
              <span className="font-bold text-zinc-800 text-xs sm:text-sm">15m Access / 7d Refresh</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
