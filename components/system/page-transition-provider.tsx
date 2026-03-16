'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

type TransitionPhase = 'idle' | 'exit' | 'enter';

type StartPageTransitionOptions = {
  delayMs?: number;
};

type PageTransitionContextValue = {
  isTransitioning: boolean;
  phase: TransitionPhase;
  startPageTransition: (
    navigate: () => void,
    options?: StartPageTransitionOptions,
  ) => void;
};

const EXIT_DURATION_MS = 240;
const ENTER_DURATION_MS = 460;

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const exitTimeoutRef = useRef<number | null>(null);
  const enterTimeoutRef = useRef<number | null>(null);
  const initialHtmlOverflowRef = useRef<string | null>(null);
  const initialBodyOverflowRef = useRef<string | null>(null);
  const initialHtmlOverscrollRef = useRef<string | null>(null);
  const [phase, setPhase] = useState<TransitionPhase>('enter');
  const [isTransitioning, setIsTransitioning] = useState(true);

  const clearExitTimeout = useCallback(() => {
    if (exitTimeoutRef.current !== null) {
      window.clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
  }, []);

  const clearEnterTimeout = useCallback(() => {
    if (enterTimeoutRef.current !== null) {
      window.clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }
  }, []);

  const finishEnter = useCallback(() => {
    clearEnterTimeout();
    enterTimeoutRef.current = window.setTimeout(() => {
      setPhase('idle');
      setIsTransitioning(false);
      enterTimeoutRef.current = null;
    }, ENTER_DURATION_MS);
  }, [clearEnterTimeout]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      finishEnter();
      return;
    }

    previousPathnameRef.current = pathname;
    clearExitTimeout();

    const frameId = window.requestAnimationFrame(() => {
      setPhase('enter');
      setIsTransitioning(true);
      finishEnter();
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [clearExitTimeout, finishEnter, pathname]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (initialHtmlOverflowRef.current === null) {
      initialHtmlOverflowRef.current = html.style.overflow;
    }

    if (initialBodyOverflowRef.current === null) {
      initialBodyOverflowRef.current = body.style.overflow;
    }

    if (initialHtmlOverscrollRef.current === null) {
      initialHtmlOverscrollRef.current = html.style.overscrollBehavior;
    }

    if (isTransitioning) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.style.overscrollBehavior = 'none';
      return;
    }

    html.style.overflow = initialHtmlOverflowRef.current ?? '';
    body.style.overflow = initialBodyOverflowRef.current ?? '';
    html.style.overscrollBehavior = initialHtmlOverscrollRef.current ?? '';
  }, [isTransitioning]);

  useEffect(() => {
    return () => {
      clearExitTimeout();
      clearEnterTimeout();
      document.documentElement.style.overflow = initialHtmlOverflowRef.current ?? '';
      document.body.style.overflow = initialBodyOverflowRef.current ?? '';
      document.documentElement.style.overscrollBehavior =
        initialHtmlOverscrollRef.current ?? '';
    };
  }, [clearEnterTimeout, clearExitTimeout]);

  const startPageTransition = useCallback(
    (navigate: () => void, options?: StartPageTransitionOptions) => {
      const delayMs = options?.delayMs ?? EXIT_DURATION_MS;
      clearExitTimeout();
      clearEnterTimeout();
      setPhase('exit');
      setIsTransitioning(true);

      exitTimeoutRef.current = window.setTimeout(() => {
        navigate();
        exitTimeoutRef.current = null;
      }, delayMs);
    },
    [clearEnterTimeout, clearExitTimeout],
  );

  const contextValue = useMemo<PageTransitionContextValue>(
    () => ({
      isTransitioning,
      phase,
      startPageTransition,
    }),
    [isTransitioning, phase, startPageTransition],
  );

  return (
    <PageTransitionContext.Provider value={contextValue}>
      <div className="relative min-h-screen overflow-x-hidden">
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-[400] overflow-hidden ${
            phase === 'exit'
              ? 'sm-page-overlay-exit'
              : phase === 'enter'
                ? 'sm-page-overlay-enter'
                : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-[#0D0F14]" />
          <div
            className={`absolute left-1/2 top-[42%] h-[44vh] w-[44vh] min-h-[260px] min-w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(167,139,250,0.14)_0%,rgba(124,58,237,0.08)_34%,rgba(13,15,20,0)_72%)] blur-2xl ${
              phase === 'exit'
                ? 'sm-page-spotlight-exit'
                : phase === 'enter'
                  ? 'sm-page-spotlight-enter'
                  : 'opacity-0'
            }`}
          />
        </div>

        <div
          className={`relative min-h-screen ${
            phase === 'exit'
              ? 'sm-page-transition-exit'
              : phase === 'enter'
                ? 'sm-page-transition-enter'
                : ''
          }`}
        >
          {children}
        </div>
      </div>
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error(
      'usePageTransition must be used within PageTransitionProvider',
    );
  }

  return context;
}
