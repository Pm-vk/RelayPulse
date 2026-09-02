'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logoutUser } from '@/store/slices/authSlice';
import { Activity, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-zinc-900">RelayPulse</span>
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-mono font-bold text-zinc-600 border border-zinc-200">
                v2.4
              </span>
            </div>
          </div>
        </Link>

        {/* Live System Indicator & User Actions */}
        <div className="flex items-center gap-5">
          {/* Real-time Indicator */}
          <div className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Engine & Sockets Connected</span>
          </div>

          {/* User Badge / Profile */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3.5 border-l border-zinc-200 pl-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white font-mono text-sm font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-zinc-900">{user.name}</p>
                    {user.role === 'ADMIN' && (
                      <span className="rounded bg-zinc-900 px-2 py-0.5 text-xs font-mono font-bold text-amber-400 border border-zinc-800">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">{user.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-zinc-200 pl-5">
              <Link
                href="/login"
                className="rounded-lg bg-zinc-900 hover:bg-zinc-800 px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
