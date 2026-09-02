'use client';

import React from 'react';
import { Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-200 py-6 px-6 text-xs sm:text-sm text-zinc-600 bg-white mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 font-mono">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-white">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <span className="font-bold text-zinc-900 text-sm">RelayPulse</span>
          <span className="text-zinc-500">— Developer Task Engine v2.4</span>
        </div>
        <div className="font-mono text-xs text-zinc-500">
          © {new Date().getFullYear()} RelayPulse Platform. All systems operational.
        </div>
      </div>
    </footer>
  );
};
