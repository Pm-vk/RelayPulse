'use client';

import React, { useState } from 'react';
import { X, Plus, Calendar, Layers, AlertCircle } from 'lucide-react';
import { CreateTaskPayload, TaskType } from '../../services/task.service';
import { Button } from '../ui/Button';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateTaskPayload) => Promise<void>;
  isLoading?: boolean;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('FILE_PROCESSING');
  const [priority, setPriority] = useState<number>(1);
  const [scheduledAt, setScheduledAt] = useState('');
  const [payloadJson, setPayloadJson] = useState('{\n  "source": "api_upload"\n}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);

    let parsedPayload = {};
    if (payloadJson.trim()) {
      try {
        parsedPayload = JSON.parse(payloadJson);
      } catch (err: any) {
        setJsonError('Invalid JSON payload format');
        return;
      }
    }

    const taskPayload: CreateTaskPayload = {
      title,
      description: description || undefined,
      type,
      priority,
      payload: Object.keys(parsedPayload).length > 0 ? parsedPayload : undefined,
      scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : undefined,
    };

    await onSubmit(taskPayload);
    // Reset form
    setTitle('');
    setDescription('');
    setType('FILE_PROCESSING');
    setPriority(1);
    setScheduledAt('');
    setPayloadJson('{\n  "source": "api_upload"\n}');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-2xl space-y-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-zinc-900">Dispatch Asynchronous Task</h2>
              <p className="text-xs text-zinc-500 font-mono">Queue job into BullMQ worker pool</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-800">Task Title *</label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={150}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Process Customer Invoice Batch #992"
              className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-800">Description (Optional)</label>
            <textarea
              rows={2}
              maxLength={1000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Operational context or task notes..."
              className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          {/* Type & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-800">Task Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs sm:text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors font-mono"
              >
                <option value="FILE_PROCESSING">File Processing</option>
                <option value="DATA_EXPORT">Data Export</option>
                <option value="REPORT_GENERATION">Report Generation</option>
                <option value="WEB_SCRAPE">Web Scrape</option>
                <option value="NOTIFICATION_DISPATCH">Notification Dispatch</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-zinc-800">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(parseInt(e.target.value, 10))}
                className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs sm:text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors font-mono"
              >
                <option value={1}>P1 - Normal Priority</option>
                <option value={2}>P2 - High Priority</option>
                <option value={3}>P3 - Critical Priority</option>
              </select>
            </div>
          </div>

          {/* Scheduled Datetime */}
          <div className="space-y-1.5">
            <label className="font-semibold text-zinc-800 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-800" />
              Schedule Datetime (Optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white p-2.5 text-xs sm:text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono transition-colors"
            />
          </div>

          {/* Payload JSON Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-800 flex items-center gap-2">
                <Layers className="h-4 w-4 text-zinc-800" />
                Payload JSON
              </label>
              {jsonError && (
                <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" /> {jsonError}
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={payloadJson}
              onChange={(e) => {
                setPayloadJson(e.target.value);
                setJsonError(null);
              }}
              className="w-full font-mono text-xs sm:text-sm rounded-lg border border-zinc-200 bg-zinc-900 p-3 text-zinc-100 focus:border-zinc-700 focus:outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
            <Button type="button" variant="ghost" size="md" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="md" isLoading={isLoading}>
              Dispatch Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
