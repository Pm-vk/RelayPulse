'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';

import { LandingPage } from '@/components/landing/LandingPage';
import { useAppSelector } from '@/store/store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CreateTaskModal } from '@/components/dashboard/CreateTaskModal';
import { TaskLogModal } from '@/components/dashboard/TaskLogModal';
import { TaskTable } from '@/components/dashboard/TaskTable';
import { TelemetryView } from '@/components/dashboard/TelemetryView';
import { AuditLogsView } from '@/components/dashboard/AuditLogsView';
import { SystemConfigView } from '@/components/dashboard/SystemConfigView';
import { useSocket } from '@/hooks/useSocket';
import {
  taskService,
  Task,
  TaskStatus,
  TaskType,
  CreateTaskPayload,
} from '@/services/task.service';
import {
  ListTodo,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Plus,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setHasToken(Boolean(localStorage.getItem('accessToken')));
  }, []);

  if (!isMounted) {
    return <LandingPage />;
  }

  if (!hasToken || showLanding) {
    return <LandingPage />;
  }

  return (
    <AuthGuard>
      <DashboardContent onShowLanding={() => setShowLanding(true)} />
    </AuthGuard>
  );
}

function DashboardContent({ onShowLanding }: { onShowLanding?: () => void }) {
  const { user } = useAppSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const { isConnected } = useSocket();
  const isAdmin = user?.role === 'ADMIN';

  // Component States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTaskForLogs, setSelectedTaskForLogs] = useState<Task | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<TaskType | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  // TanStack Query: Fetch Tasks
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    refetch: refetchTasks,
  } = useQuery({
    queryKey: ['tasks', user?.id, user?.role, search, statusFilter, typeFilter, page],
    queryFn: () =>
      taskService.getTasks({
        search: search || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        type: typeFilter === 'ALL' ? undefined : typeFilter,
        page,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    enabled: Boolean(user?.id),
  });

  // TanStack Query: Fetch Stats Summary
  const { data: statsData } = useQuery({
    queryKey: ['taskStats', user?.id, user?.role],
    queryFn: () => taskService.getStatsSummary(),
    enabled: Boolean(user?.id),
    refetchInterval: 5000,
  });

  // Mutations
  const createTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskService.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });

  const retryTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskService.retryTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskStats'] });
    },
  });

  const handleCreateTask = async (payload: CreateTaskPayload) => {
    await createTaskMutation.mutateAsync(payload);
  };

  const handleRetryTask = (taskId: string) => {
    retryTaskMutation.mutate(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      <div className="flex flex-1">
        {/* Left Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full">
          {activeTab === 'analytics' ? (
            <TelemetryView statsData={statsData} />
          ) : activeTab === 'audit' ? (
            <AuditLogsView />
          ) : activeTab === 'settings' ? (
            <SystemConfigView />
          ) : (
            <>
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant={isConnected ? 'COMPLETED' : 'FAILED'} pulse={isConnected}>
                      {isConnected ? 'Socket.IO Stream Connected' : 'Connecting Sockets...'}
                    </Badge>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-zinc-600">• BullMQ Redis Engine</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
                    {activeTab === 'tasks' ? 'Task Queue Management' : 'Task Automation & Event Dispatcher'}
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-600 mt-1 font-mono">
                    Live queue concurrency metrics, worker status, and automated background job logs.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => refetchTasks()}
                    className="gap-2 text-xs sm:text-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Queue
                  </Button>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="gap-2 text-xs sm:text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Create Task
                  </Button>
                </div>
              </div>

              {/* Executive Overview Metric Cards (Dashboard Tab Only) */}
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <Card className="p-5 border-zinc-200 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                        Total Enqueued Tasks
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
                        <ListTodo className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-zinc-900">{statsData?.total || 0}</span>
                      <span className="text-xs font-mono font-bold text-emerald-600 flex items-center gap-0.5">
                        <TrendingUp className="h-3.5 w-3.5" /> Live
                      </span>
                    </div>
                  </Card>

                  <Card className="p-5 border-zinc-200 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                        Active Running / Queued
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/30">
                        <PlayCircle className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-700">
                        {(statsData?.processing || 0) + (statsData?.pending || 0)}
                      </span>
                      <span className="text-xs font-mono text-zinc-600 font-semibold">
                        {statsData?.processing || 0} running, {statsData?.pending || 0} queued
                      </span>
                    </div>
                  </Card>

                  <Card className="p-5 border-zinc-200 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                        Completed Jobs
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-700">{statsData?.completed || 0}</span>
                      <span className="text-xs font-mono text-zinc-600 font-semibold">100% processed</span>
                    </div>
                  </Card>

                  <Card className="p-5 border-zinc-200 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                        Failed Exceptions
                      </span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-700 border border-rose-500/30">
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2.5">
                      <span className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-700">{statsData?.failed || 0}</span>
                      <span className="text-xs font-mono text-zinc-600 font-semibold">Max retries limit</span>
                    </div>
                  </Card>
                </div>
              )}

              {/* Admin Overview Mode Banner */}
              {isAdmin && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-xs sm:text-sm text-zinc-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-amber-400 font-bold border border-zinc-700">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-bold uppercase tracking-wider text-amber-400 font-mono text-xs sm:text-sm">System-Wide Admin Governance</span>
                      <p className="text-xs text-zinc-400 font-mono mt-0.5">
                        Global administrative access active. Monitoring telemetry and retrying jobs across all user workspaces.
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-zinc-800 px-3 py-1 text-xs font-mono font-bold text-amber-400 border border-zinc-700 shrink-0">
                    GLOBAL ACCESS
                  </span>
                </div>
              )}

              {/* Interactive Task Queue Table */}
              <TaskTable
                tasks={tasksData?.tasks || []}
                pagination={
                  tasksData?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }
                }
                search={search}
                onSearchChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(st) => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                typeFilter={typeFilter}
                onTypeFilterChange={(tp) => {
                  setTypeFilter(tp);
                  setPage(1);
                }}
                page={page}
                onPageChange={(p) => setPage(p)}
                onViewLogs={(task) => setSelectedTaskForLogs(task)}
                onRetryTask={handleRetryTask}
                onDeleteTask={handleDeleteTask}
                isLoading={isTasksLoading}
                isAdmin={isAdmin}
              />
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        isLoading={createTaskMutation.isPending}
      />

      <TaskLogModal
        task={selectedTaskForLogs}
        isOpen={!!selectedTaskForLogs}
        onClose={() => setSelectedTaskForLogs(null)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
