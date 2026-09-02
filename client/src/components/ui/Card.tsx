import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, hover = true, className = '', ...props }) => {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${
        hover ? 'transition-all duration-200 hover:border-zinc-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
