'use client';

import React from 'react';
import { Task, TaskStatus, TaskType } from '../../services/task.service';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Search, RotateCcw, Trash2, Eye } from 'lucide-react';

interface TaskTableProps {
  tasks: (Task & { user?: { email: string; name: string } })[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: TaskStatus | 'ALL';
  onStatusFilterChange: (status: TaskStatus | 'ALL') => void;
  typeFilter: TaskType | 'ALL';
  onTypeFilterChange: (type: TaskType | 'ALL') => void;
  page: number;
  onPageChange: (newPage: number) => void;
  onViewLogs: (task: Task) => void;
  onRetryTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  isLoading?: boolean;
  isAdmin?: boolean;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  pagination,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  typeFilter,
  onTypeFilterChange,
  page,
  onPageChange,
  onViewLogs,
  onRetryTask,
  onDeleteTask,
  isLoading = false,
  isAdmin = false,
}) => {
  const statusTabs: Array<{ id: TaskStatus | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Tasks' },
    { id: 'PENDING', label: 'Queued' },
    { id: 'PROCESSING', label: 'Running' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'FAILED', label: 'Failed' },
  ];

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onStatusFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-mono font-semibold transition-all ${
                statusFilter === tab.id
                  ? 'bg-zinc-900 text-white font-bold shadow-sm'
                  : 'bg-zinc-50 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Type Dropdown */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter tasks or ID..."
              className="w-full rounded-md border border-zinc-200 bg-white py-2 pl-9 pr-3 text-xs sm:text-sm font-mono text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          {/* Type Dropdown Filter */}
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value as TaskType | 'ALL')}
            className="rounded-md border border-zinc-200 bg-white py-2 px-3 text-xs sm:text-sm font-mono text-zinc-800 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
          >
            <option value="ALL">All Types</option>
            <option value="FILE_PROCESSING">File Processing</option>
            <option value="DATA_EXPORT">Data Export</option>
            <option value="REPORT_GENERATION">Report Generation</option>
            <option value="WEB_SCRAPE">Web Scrape</option>
            <option value="NOTIFICATION_DISPATCH">Notification Dispatch</option>
          </select>
        </div>
      </div>

      {/* Task Queue Table */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-200 text-zinc-600 uppercase tracking-wider font-mono text-xs font-bold bg-zinc-50">
              <th className="py-3 px-4">Task & ID</th>
              {isAdmin && <th className="py-3 px-4 font-bold text-zinc-900">Tenant Owner</th>}
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Progress</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {isLoading ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="py-10 text-center text-zinc-600 font-mono text-sm">
                  <div className="flex justify-center items-center gap-2.5">
                    <svg className="h-5 w-5 animate-spin text-zinc-900" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Fetching Task Queue...</span>
                  </div>
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} className="py-12 text-center text-zinc-500 font-mono text-sm italic">
                  No task records found matching your active filter constraints.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="group hover:bg-zinc-50 transition-colors duration-150"
                >
                  {/* Title & Type */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-bold text-sm text-zinc-900 truncate group-hover:text-zinc-900">
                      {task.title}
                    </div>
                    <div className="text-xs text-zinc-500 font-mono mt-1 flex items-center gap-2">
                      <span className="text-zinc-500 font-medium">id:{task.id.slice(0, 8)}</span>
                      <span>•</span>
                      <span className="text-zinc-800 font-bold">{task.type}</span>
                    </div>
                  </td>

                  {/* Task Owner (Admin View) */}
                  {isAdmin && (
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <span className="rounded bg-zinc-100 border border-zinc-200 px-2 py-1 text-zinc-800 font-semibold">
                        {task.user?.email || 'System'}
                      </span>
                    </td>
                  )}

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <Badge variant={task.status} />
                  </td>

                  {/* Minimalist 3px Progress Bar */}
                  <td className="py-3.5 px-4 min-w-[140px]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden border border-zinc-200/50">
                        <div
                          className={`h-full transition-all duration-300 ${
                            task.status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : task.status === 'FAILED'
                              ? 'bg-rose-500'
                              : 'bg-amber-500 animate-pulse'
                          }`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-zinc-700 font-bold shrink-0">{task.progress}%</span>
                    </div>
                  </td>

                  {/* Priority Tag */}
                  <td className="py-3.5 px-4 font-mono text-xs">
                    <span
                      className={`rounded px-2 py-0.5 font-bold ${
                        task.priority === 3
                          ? 'bg-rose-500/10 text-rose-700 border border-rose-500/30'
                          : task.priority === 2
                          ? 'bg-amber-500/10 text-amber-700 border border-amber-500/30'
                          : 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                      }`}
                    >
                      P{task.priority}
                    </span>
                  </td>

                  {/* Created Time */}
                  <td className="py-3.5 px-4 text-zinc-600 font-mono text-xs">
                    {new Date(task.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>

                  {/* Ghost Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* View Logs Button */}
                      <button
                        onClick={() => onViewLogs(task)}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 transition-colors"
                        title="View Logs & Payload"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Retry Button */}
                      {task.status === 'FAILED' && (
                        <button
                          onClick={() => onRetryTask(task.id)}
                          className="p-1.5 rounded-md text-amber-700 hover:bg-amber-100 transition-colors"
                          title="Re-queue Task"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-100 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-zinc-200 bg-zinc-50 font-mono text-xs sm:text-sm text-zinc-600">
          <div>
            Page <span className="font-bold text-zinc-900">{pagination.page}</span> of{' '}
            <span className="font-bold text-zinc-900">{pagination.totalPages || 1}</span> ({pagination.total} tasks)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              Previous
            </Button>

            <Button
              variant="secondary"
              size="sm"
              disabled={page >= pagination.totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
