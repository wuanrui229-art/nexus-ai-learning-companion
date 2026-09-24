import React from 'react';
import { cn } from '../../lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'blockquote' | 'lead' | 'large' | 'small' | 'muted';
}

export const Typography = ({ children, className, variant = 'p' }: TypographyProps) => {
  const baseStyles = {
    h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    h2: 'scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0',
    h3: 'scroll-m-20 text-xl font-semibold tracking-tight',
    h4: 'scroll-m-20 text-lg font-semibold tracking-tight',
    p: 'leading-7 [&:not(:first-child)]:mt-6',
    blockquote: 'mt-6 border-l-2 pl-6 italic',
    lead: 'text-xl text-muted-foreground',
    large: 'text-lg font-semibold',
    small: 'text-sm font-medium leading-none',
    muted: 'text-sm text-muted-foreground',
  };

  const Component = (variant.startsWith('h') ? variant : 'p') as any;

  return (
    <Component className={cn(baseStyles[variant], className)}>
      {children}
    </Component>
  );
};
