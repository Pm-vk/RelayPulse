'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { Activity, Lock, Mail, ArrowRight, KeyRound } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAFAFA] p-4 text-zinc-900 selection:bg-zinc-900 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 shadow-md text-white">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">Sign in to RelayPulse</h1>
          <p className="text-sm text-zinc-600 font-mono">
            Developer task engine & distributed job telemetry console
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border-zinc-200 bg-white p-7 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs sm:text-sm text-rose-700 font-mono">
                <span className="font-bold">Auth Error:</span> {error}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-zinc-800">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@taskforge.ai"
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm font-mono text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-zinc-800">Password</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-3 text-sm font-mono text-zinc-900 placeholder-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isLoading}
              className="w-full mt-3 text-sm sm:text-base py-3"
            >
              Sign In to Console <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="mt-6 border-t border-zinc-200 pt-5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
              <KeyRound className="h-3.5 w-3.5 text-zinc-800" />
              <span>Quick Demo Accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => handleFillDemo('user@taskforge.ai', 'UserPassword123!')}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-left hover:border-zinc-400 transition-all"
              >
                <div className="font-bold text-zinc-900 text-xs">Demo User</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">user@taskforge.ai</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin@taskforge.ai', 'AdminPassword123!')}
                className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-left hover:border-zinc-400 transition-all"
              >
                <div className="font-bold text-zinc-900 text-xs">Admin User</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">admin@taskforge.ai</div>
              </button>
            </div>
          </div>
        </Card>

        {/* Footer Link to Register */}
        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have a workspace?{' '}
          <Link href="/register" className="font-bold text-zinc-900 underline hover:text-zinc-700">
            Create new account
          </Link>
        </p>
      </div>
    </div>
  );
}
