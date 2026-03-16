'use client';

import { useEffect, type HTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  overlayClassName?: string;
  panelClassName?: string;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  open,
  onClose,
  children,
  overlayClassName,
  panelClassName,
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === 'undefined' || !open) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[500] flex items-start justify-center bg-black/60 p-4 sm:items-center sm:p-6 print:hidden',
        overlayClassName,
      )}
      onClick={() => {
        if (closeOnOverlayClick) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-2xl border border-[#1E2130] bg-[#13161D] shadow-[0_24px_64px_rgba(0,0,0,0.45)]',
          panelClassName,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function ModalHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-[#1E2130] px-6 py-4',
        className,
      )}
      {...props}
    />
  );
}

export function ModalTitle({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'text-xs font-mono uppercase tracking-[0.14em] text-[#6B7280]',
        className,
      )}
      {...props}
    />
  );
}

export function ModalDescription({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('text-sm font-medium text-[#E8EAF0]', className)}
      {...props}
    />
  );
}

export function ModalBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('overflow-y-auto overflow-x-hidden p-4 sm:p-5', className)}
      {...props}
    />
  );
}

export function ModalFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-t border-[#1E2130] px-6 py-4',
        className,
      )}
      {...props}
    />
  );
}
