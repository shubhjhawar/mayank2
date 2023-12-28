import {ReactNode} from 'react';
import clsx from 'clsx';

export interface ContentGridProps {
  className?: string;
  children: ReactNode;
  variant?: 'portrait' | 'landscape';
}
export function ContentGridLayout({
  children,
  className,
  variant,
}: ContentGridProps) {
  return (
    <div
      className={clsx(
        'grid grid-cols-[repeat(var(--nVisibleItems),minmax(0,1fr))] gap-24',
        className,
        variant === 'landscape'
          ? 'content-grid-landscape'
          : 'content-grid-portrait'
      )}
    >
      {children}
    </div>
  );
}
