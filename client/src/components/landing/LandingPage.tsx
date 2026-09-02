'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/store';
import {
  Activity,
  Zap,
  Shield,
  Cpu,
  Terminal,
  CheckCircle2,
  ArrowRight,
  Code2,
  Lock,
  ChevronDown,
  Copy,
  Check,
  Layers,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  // Telemetry Simulation State
  const [demoProgress, setDemoProgress] = useState(45);
  const [demoStatus, setDemoStatus] = useState<'PENDING' | 'PROCESSING' | 'COMPLETED'>('PROCESSING');
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'node' | 'python' | 'go'>('node');
  const [copied, setCopied] = useState(false);
  const [activeTerminalTab, setActiveTerminalTab] = useState<'logs' | 'payload' | 'workers'>('logs');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simulate real-time job progress ring
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoProgress((prev) => {
        if (prev >= 100) {
          setDemoStatus('COMPLETED');
          setTimeout(() => {
            setDemoProgress(0);
            setDemoStatus('PROCESSING');
          }, 2000);
          return 100;
        }
        return prev + 15;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-zinc-900" />,
      title: 'BullMQ & Redis Queue Core',
      description:
        'High-concurrency background processing powered by Redis 7 & BullMQ engine with exponential backoff retry algorithms.',
      badge: 'Sub-2ms Transport',
    },
    {
      icon: <Activity className="h-6 w-6 text-zinc-900" />,
      title: 'Real-Time WebSocket Streams',
      description:
        'Bi-directional Socket.IO telemetry broadcasting job state transitions (`job:progress`, `job:completed`, `job:failed`) without polling.',
      badge: 'Zero Polling',
    },
    {
      icon: <Shield className="h-6 w-6 text-zinc-900" />,
      title: 'Enterprise Multi-Tenant Security',
      description:
        'Isolated tenant job isolation, dual JWT access/refresh token rotation, and administrative oversight telemetry.',
      badge: 'JWT + RBAC',
    },
    {
      icon: <Cpu className="h-6 w-6 text-zinc-900" />,
      title: 'Decoupled Worker Concurrency',
      description:
        'Scale stateless worker pools across file extraction, report generation, scraping, and notification pipelines.',
      badge: 'Multi-Threaded',
    },
    {
      icon: <Terminal className="h-6 w-6 text-zinc-900" />,
      title: 'Deep Execution Diagnostics',
      description:
        'Comprehensive step-by-step audit trails, latency metrics, raw payload inspection, and full error trace logging.',
      badge: 'Structured Logs',
    },
    {
      icon: <Layers className="h-6 w-6 text-zinc-900" />,
      title: 'Docker & Microservices Ready',
      description:
        'Containerized production setup with multi-stage Dockerfiles, Docker Compose orchestrations, and automated CI/CD.',
      badge: 'Cloud Native',
    },
  ];

  const codeSnippets = {
    node: `import { RelayPulse } from '@relaypulse/sdk';

const client = new RelayPulse({ apiKey: process.env.RELAYPULSE_API_KEY });

// Enqueue asynchronous job
const task = await client.tasks.dispatch({
  title: 'Process Customer Invoice PDF',
  type: 'FILE_PROCESSING',
  priority: 2,
  payload: { fileUrl: 'https://s3.aws.com/inv_99201.pdf', format: 'PDF' }
});

console.log(\`[RelayPulse] Enqueued Task ID: \${task.id}\`);`,
    curl: `curl -X POST http://localhost:5001/api/v1/tasks \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Batch Image Compression",
    "type": "FILE_PROCESSING",
    "priority": 3,
    "payload": { "folder": "/uploads/raw" }
  }'`,
    python: `from relaypulse import RelayPulseClient

client = RelayPulseClient(api_key="rp_live_secret_key")

task = client.dispatch_task(
    title="Generate Quarterly Financial PDF",
    type="REPORT_GENERATION",
    priority=1,
    payload={"period": "Q2-2026", "include_charts": True}
)

print(f"Task dispatched successfully: {task['id']}")`,
    go: `package main

import (
	"fmt"
	"github.com/relaypulse/relaypulse-go"
)

func main() {
	client := relaypulse.NewClient("rp_live_secret_key")
	task, err := client.DispatchTask(&relaypulse.TaskOptions{
		Title:    "Dispatch Notification Batch",
		Type:     "NOTIFICATION_DISPATCH",
		Priority: 2,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Task ID: %s enqueued\n", task.ID)
}`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const faqs = [
    {
      q: 'How does RelayPulse achieve sub-millisecond job transport?',
      a: 'RelayPulse leverages Redis 7 in-memory queues managed by BullMQ. Jobs are pushed directly to Redis lists with minimal transport overhead, while events are streamed instantly to connected browser clients over persistent WebSockets.',
    },
    {
      q: 'Can RelayPulse be deployed into existing Kubernetes or Docker infrastructure?',
      a: 'Yes. RelayPulse comes with pre-built multi-stage Dockerfiles and Docker Compose files for API Gateway, BullMQ Worker, and Frontend Next.js services.',
    },
    {
      q: 'How does multi-tenant data isolation work?',
      a: 'Each task request is bound to the user context resolved via JWT tokens. Database queries and socket subscriptions are strictly scoped to the tenant ID unless authenticated with an ADMIN role.',
    },
    {
      q: 'What happens when a background worker task fails?',
      a: 'RelayPulse automatically triggers an exponential backoff retry strategy up to the maxAttempts limit configured for that task type, capturing full error stack traces into the audit log.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden">
      {/* Top Glass Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-zinc-900">RelayPulse</span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono font-bold text-zinc-600 border border-zinc-200">
                v2.4 PLATFORM
              </span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-4">
            {isMounted && isAuthenticated ? (
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm"
              >
                <span>Console Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-900 transition-colors px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs sm:text-sm font-semibold text-white transition-all shadow-sm hover:-translate-y-0.5"
                >
                  <span>Start Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 max-w-7xl mx-auto border-b border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-mono font-semibold text-zinc-800 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>BullMQ 5.0 + Redis 7 Queue Engine</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 leading-[1.06]">
              High-Concurrency <br />
              <span className="text-zinc-900 underline decoration-zinc-300 underline-offset-8">
                Task Engine & Dispatcher
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-xl">
              Reliable background queue processing, real-time WebSocket telemetry, and automated retry policies built for high-throughput microservices.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-sm hover:-translate-y-0.5 transition-all"
              >
                <span>Launch Console Demo</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-6 py-3.5 text-sm sm:text-base font-semibold text-zinc-900 hover:bg-zinc-50 transition-all shadow-sm"
              >
                <Lock className="h-4 w-4 text-zinc-600" />
                <span>Sign In with Demo Account</span>
              </Link>
            </div>

            {/* Micro Specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 text-left font-mono">
              <div>
                <div className="text-sm sm:text-base font-bold text-zinc-900">&lt; 1.8 ms</div>
                <div className="text-xs sm:text-sm text-zinc-500 font-sans">Queue Transport</div>
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-zinc-900">5,000+</div>
                <div className="text-xs sm:text-sm text-zinc-500 font-sans">Jobs / Sec</div>
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-zinc-900">99.99%</div>
                <div className="text-xs sm:text-sm text-zinc-500 font-sans">Queue SLA</div>
              </div>
            </div>
          </div>

          {/* Live Telemetry Terminal Preview Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-zinc-800 bg-[#09090B] p-5 text-zinc-300 shadow-2xl space-y-4 font-mono text-xs sm:text-sm">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <div className="h-3 w-3 rounded-full bg-zinc-700" />
                  <span className="ml-2 text-xs text-zinc-400">relaypulse-worker-node-01</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-bold">WORKER POOL ACTIVE</span>
                </div>
              </div>

              {/* Terminal Tabs */}
              <div className="flex items-center gap-4 border-b border-zinc-800 pb-2.5 text-xs sm:text-sm">
                <button
                  onClick={() => setActiveTerminalTab('logs')}
                  className={`pb-1 transition-all ${
                    activeTerminalTab === 'logs' ? 'text-white border-b-2 border-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Execution Logs
                </button>
                <button
                  onClick={() => setActiveTerminalTab('payload')}
                  className={`pb-1 transition-all ${
                    activeTerminalTab === 'payload' ? 'text-white border-b-2 border-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Payload Inspector
                </button>
                <button
                  onClick={() => setActiveTerminalTab('workers')}
                  className={`pb-1 transition-all ${
                    activeTerminalTab === 'workers' ? 'text-white border-b-2 border-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Worker Telemetry
                </button>
              </div>

              {/* Terminal Tab Content */}
              {activeTerminalTab === 'logs' && (
                <div className="space-y-2 py-1">
                  <div className="text-zinc-500">[21:40:01] ⚡ BullMQ worker listening on Redis queue: task_queue</div>
                  <div className="text-zinc-200">
                    [21:40:04] 🔄 [Worker #2] Picked up Job #rp_8841 (FILE_PROCESSING)
                  </div>
                  <div className="text-amber-400 flex items-center justify-between">
                    <span>[21:40:05] 📊 Socket.IO emitting `job:progress` event...</span>
                    <span>{demoProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 rounded-full h-1.5 my-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${demoProgress}%` }} />
                  </div>
                  {demoStatus === 'COMPLETED' && (
                    <div className="text-emerald-400 font-bold">
                      [21:40:07] ✅ Job #rp_8841 COMPLETED in 1.4s (Status Code: 200 OK)
                    </div>
                  )}
                </div>
              )}

              {activeTerminalTab === 'payload' && (
                <pre className="text-xs sm:text-sm text-amber-300 bg-zinc-900 p-4 rounded-lg border border-zinc-800 overflow-x-auto">
{`{
  "taskId": "rp_8841",
  "type": "FILE_PROCESSING",
  "priority": 2,
  "payload": {
    "file": "customer_data_2026.csv",
    "sizeBytes": 481200,
    "options": { "compress": true }
  }
}`}
                </pre>
              )}

              {activeTerminalTab === 'workers' && (
                <div className="space-y-2.5 py-1 text-xs sm:text-sm">
                  <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
                    <span>Worker Thread #1 (Files)</span>
                    <span className="text-emerald-400 font-bold">ACTIVE (32% CPU)</span>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
                    <span>Worker Thread #2 (Reports)</span>
                    <span className="text-amber-400 font-bold">PROCESSING ({demoProgress}%)</span>
                  </div>
                  <div className="flex justify-between items-center bg-zinc-900 p-2.5 rounded border border-zinc-800">
                    <span>Worker Thread #3 (Scraper)</span>
                    <span className="text-zinc-400">IDLE</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-200">
        <div className="text-left max-w-3xl mb-14 space-y-3">
          <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">
            System Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 tracking-tight">
            Engineered for Modern Scale & Resiliency
          </h2>
          <p className="text-base sm:text-lg text-zinc-600">
            Modular background architecture designed with strict TypeScript schemas and real-time observability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-7 transition-all duration-200 hover:border-zinc-300 hover:shadow-md space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-900">
                  {feature.icon}
                </div>
                <span className="text-xs font-mono font-bold text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200">
                  {feature.badge}
                </span>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900">{feature.title}</h3>
                <p className="text-sm text-zinc-600 leading-relaxed mt-2">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Code Demo Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-b border-zinc-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-mono font-bold text-zinc-800">
              <Code2 className="h-4 w-4" />
              <span>Clean REST APIs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Dispatch Tasks via Microsecond REST Calls
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              Integrate background task execution seamlessly across Node.js, cURL, Python, or Go microservices using JWT authenticated endpoints.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-800 font-semibold pt-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Strict Zod payload schema validation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Custom priority levels (P1-P3) and scheduled datetime queueing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                <span>Standardized JSON response envelope</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-xl border border-zinc-800 bg-[#09090B] p-5 text-zinc-200 shadow-xl space-y-4 font-mono text-xs sm:text-sm">
              {/* Code Tab Switcher */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  {(['node', 'curl', 'python', 'go'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveCodeTab(lang)}
                      className={`px-3 py-1.5 rounded text-xs sm:text-sm font-mono font-bold transition-all ${
                        activeCodeTab === lang
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code Snippet Display */}
              <pre className="text-xs sm:text-sm text-zinc-300 leading-relaxed overflow-x-auto p-3">
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto border-b border-zinc-200">
        <div className="text-center mb-12 space-y-2">
          <div className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider text-zinc-500">
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900">Technical Details & Specifications</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-base sm:text-lg font-bold text-zinc-900 hover:text-zinc-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-zinc-900' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-zinc-900 p-10 sm:p-16 text-center space-y-6 shadow-xl text-white">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Accelerate Your Task Pipeline?
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Access live BullMQ worker queues, real-time Socket.IO telemetry, and enterprise admin features.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto rounded-lg bg-white px-8 py-4 text-sm sm:text-base font-bold text-zinc-900 hover:bg-zinc-100 transition-all shadow-sm"
            >
              Create Free Workspace
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto rounded-lg border border-zinc-700 bg-zinc-800 px-8 py-4 text-sm sm:text-base font-semibold text-white hover:bg-zinc-700 transition-all"
            >
              Sign In to Console
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
