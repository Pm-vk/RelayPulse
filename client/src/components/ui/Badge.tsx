import React from 'react';

export type BadgeVariant = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'INFO' | 'ADMIN' | 'USER';

interface BadgeProps {
  variant: BadgeVariant;
  children?: React.ReactNode;
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ variant, children, pulse }) => {
  const styles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    PENDING: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-700',
      border: 'border-zinc-300',
      dot: 'bg-zinc-400',
    },
    PROCESSING: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700',
      border: 'border-amber-500/30',
      dot: 'bg-amber-500',
    },
    COMPLETED: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-700',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    FAILED: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-700',
      border: 'border-rose-500/30',
      dot: 'bg-rose-500',
    },
    INFO: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-700',
      border: 'border-zinc-300',
      dot: 'bg-zinc-500',
    },
    ADMIN: {
      bg: 'bg-zinc-900',
      text: 'text-zinc-100',
      border: 'border-zinc-800',
      dot: 'bg-amber-400',
    },
    USER: {
      bg: 'bg-zinc-100',
      text: 'text-zinc-700',
      border: 'border-zinc-300',
      dot: 'bg-zinc-400',
    },
  };

  const style = styles[variant] || styles.INFO;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-mono font-semibold tracking-tight ${style.bg} ${style.text} ${style.border}`}
    >
      <span
        className={`h-2 w-2 rounded-full shrink-0 ${style.dot} ${
          pulse || variant === 'PROCESSING' ? 'animate-pulse' : ''
        }`}
      />
      {children || variant}
    </span>
  );
};
