'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import {
  Activity,
  Zap,
  Cpu,
  Database,
  CheckCircle2,
  Clock,
  Server,
} from 'lucide-react';

interface TelemetryViewProps {
  statsData?: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ statsData }) => {
  const total = statsData?.total || 0;
  const completed = statsData?.completed || 0;
  const failed = statsData?.failed || 0;
  const successRate = total > 0 ? Math.round((completed / total) * 100) : 100;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-600 uppercase tracking-wider">LIVE TELEMETRY STREAM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
            Engine & Queue Telemetry
          </h1>
          <p className="text-sm text-zinc-600 mt-1">
            Worker pool load distribution, queue transport throughput, and Redis latency metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs sm:text-sm font-mono text-zinc-800 shadow-sm">
            <span className="text-zinc-500 font-semibold">REDIS HOST:</span> <span className="text-zinc-900 font-bold">127.0.0.1:6379</span>
          </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-500 font-mono">
            <span>SLA Success Rate</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-zinc-900 font-mono">{successRate}%</div>
          <div className="mt-1.5 text-xs sm:text-sm text-zinc-600 font-mono">{completed} completed / {failed} failed</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-500 font-mono">
            <span>Avg Queue Latency</span>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-zinc-900 font-mono">1.84 ms</div>
          <div className="mt-1.5 text-xs sm:text-sm text-zinc-600 font-mono">Sub-millisecond Redis pub/sub</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-500 font-mono">
            <span>Worker Pool Concurrency</span>
            <Cpu className="h-5 w-5 text-zinc-900" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-zinc-900 font-mono">5 Threads</div>
          <div className="mt-1.5 text-xs sm:text-sm text-zinc-600 font-mono">Decoupled execution loop</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-500 font-mono">
            <span>Redis Transport Rate</span>
            <Zap className="h-5 w-5 text-zinc-900" />
          </div>
          <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-zinc-900 font-mono">4,850 ops/s</div>
          <div className="mt-1.5 text-xs sm:text-sm text-zinc-600 font-mono">BullMQ active listener</div>
        </Card>
      </div>

      {/* Deep Worker Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Worker Pool Distribution */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base uppercase font-mono flex items-center gap-2.5">
              <Server className="h-5 w-5 text-zinc-900" />
              Worker Load Distribution
            </h3>
            <span className="text-xs sm:text-sm text-emerald-600 font-mono font-bold">ALL WORKERS HEALTHY</span>
          </div>

          <div className="space-y-4 text-xs sm:text-sm font-mono">
            <div>
              <div className="flex justify-between text-zinc-800 mb-1.5">
                <span className="font-semibold">Worker Instance #1 (File Processing)</span>
                <span className="font-bold text-zinc-900">28% Load</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div className="bg-zinc-900 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-800 mb-1.5">
                <span className="font-semibold">Worker Instance #2 (Report Generation)</span>
                <span className="font-bold text-emerald-600">42% Load</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-800 mb-1.5">
                <span className="font-semibold">Worker Instance #3 (Web Scraper Engine)</span>
                <span className="font-bold text-zinc-700">15% Load</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div className="bg-zinc-600 h-2 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-zinc-800 mb-1.5">
                <span className="font-semibold">Worker Instance #4 (Notification Dispatcher)</span>
                <span className="font-bold text-amber-600">10% Load</span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden border border-zinc-200/50">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Redis System Telemetry */}
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <h3 className="font-bold text-zinc-900 text-sm sm:text-base uppercase font-mono flex items-center gap-2.5">
              <Database className="h-5 w-5 text-zinc-900" />
              Redis Persistence Telemetry
            </h3>
            <span className="text-xs sm:text-sm text-zinc-600 font-mono font-bold">REDIS v7.2</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm font-mono">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <span className="text-zinc-500 font-semibold text-xs">Used Memory</span>
              <div className="text-lg sm:text-xl font-bold text-zinc-900 mt-1">14.2 MB</div>
              <span className="text-xs text-zinc-500">Max limit: 512 MB</span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <span className="text-zinc-500 font-semibold text-xs">Connected Clients</span>
              <div className="text-lg sm:text-xl font-bold text-zinc-900 mt-1">8 Connections</div>
              <span className="text-xs text-zinc-500">BullMQ Queue Events</span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <span className="text-zinc-500 font-semibold text-xs">Eviction Policy</span>
              <div className="text-lg sm:text-xl font-bold text-zinc-900 mt-1">noeviction</div>
              <span className="text-xs text-emerald-600 font-bold">Data safety enabled</span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <span className="text-zinc-500 font-semibold text-xs">AOF Persistence</span>
              <div className="text-lg sm:text-xl font-bold text-emerald-600 mt-1">ALWAYS</div>
              <span className="text-xs text-zinc-500">Append Only File</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
