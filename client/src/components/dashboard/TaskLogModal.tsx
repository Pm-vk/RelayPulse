'use client';

import React from 'react';
import { X, Activity, Terminal } from 'lucide-react';
import { Task } from '../../services/task.service';
import { Badge } from '../ui/Badge';

interface TaskLogModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskLogModal: React.FC<TaskLogModalProps> = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base sm:text-lg font-extrabold text-zinc-900">{task.title}</h2>
                <Badge variant={task.status} />
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 font-mono mt-1">
                id:{task.id} • {task.type} • {task.progress}% complete
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Task Details Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs sm:text-sm font-mono">
          <div>
            <span className="text-zinc-500 block text-xs font-semibold">Attempts</span>
            <span className="font-bold text-zinc-900">{task.attempts} / {task.maxAttempts}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-xs font-semibold">Priority</span>
            <span className="font-bold text-zinc-900">P{task.priority}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-xs font-semibold">Created At</span>
            <span className="text-zinc-800 font-semibold">{new Date(task.createdAt).toLocaleTimeString()}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-xs font-semibold">Completed At</span>
            <span className="text-zinc-800 font-semibold">
              {task.completedAt ? new Date(task.completedAt).toLocaleTimeString() : '-'}
            </span>
          </div>
        </div>

        {/* Result or Error Message if available */}
        {task.error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm font-mono text-rose-700">
            <span className="font-bold">Error Output:</span> {task.error}
          </div>
        )}

        {task.result && (
          <div className="space-y-1.5">
            <span className="text-xs sm:text-sm font-mono font-bold text-zinc-800">Execution Result Output:</span>
            <pre className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto max-h-40">
              {JSON.stringify(task.result, null, 2)}
            </pre>
          </div>
        )}

        {/* Audit Logs List */}
        <div className="space-y-2.5">
          <h3 className="text-xs sm:text-sm font-mono font-bold text-zinc-900 uppercase flex items-center gap-2">
            <Activity className="h-4 w-4 text-zinc-900" />
            Execution Audit Logs ({task.taskLogs?.length || 0})
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {task.taskLogs && task.taskLogs.length > 0 ? (
              task.taskLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#09090B] border border-zinc-800 text-xs sm:text-sm font-mono text-zinc-200"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                        log.level === 'ERROR'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : log.level === 'WARN'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span>{log.message}</span>
                  </div>
                  <span className="text-xs text-zinc-500 shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-zinc-500 font-mono italic py-4 text-center">No logs generated for this task yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
