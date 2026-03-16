'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { startTransition, useMemo, useState } from 'react';

import { usePageTransition } from '@/components/system/page-transition-provider';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';
import { ArrowRight, Sparkles } from 'lucide-react';

type Mode = 'signin' | 'signup';
const INPUT_ACCENT = '#7C3AED';
const INPUT_ACCENT_RING = 'rgba(124, 58, 237, 0.22)';
const SUCCESS_ANIMATION_MS = 520;

export default function LoginClient() {
  const router = useRouter();
  const { startPageTransition } = usePageTransition();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/dashboard';

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccessAnimating, setIsSuccessAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isBusy = submitting || isSuccessAnimating;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBusy) return;

    setError(null);
    setSubmitting(true);
    let didSucceed = false;

    try {
      const result =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      didSucceed = true;
      setIsSuccessAnimating(true);

      await new Promise((resolve) =>
        window.setTimeout(resolve, SUCCESS_ANIMATION_MS),
      );

      startPageTransition(
        () => {
          startTransition(() => {
            router.push(nextPath);
            router.refresh();
          });
        },
        { delayMs: 0 },
      );
    } finally {
      if (!didSucceed) {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0D0F14] p-6 text-[#E8EAF0]">
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${
          isSuccessAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.24)_0%,rgba(124,58,237,0.10)_24%,rgba(13,15,20,0)_62%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(124,58,237,0.08)_0%,rgba(13,15,20,0)_46%)]" />
      </div>

      <div
        className={`relative w-full max-w-md rounded-2xl border border-[#1E2130] bg-[#13161D] p-7 shadow-[0_24px_64px_rgba(0,0,0,0.35)] transition-all duration-500 ${
          isSuccessAnimating
            ? '-translate-y-3 scale-[0.97] border-[#7C3AED55] opacity-0 blur-sm'
            : 'translate-y-0 scale-100 opacity-100 blur-0'
        }`}
      >
        <div className="mb-6 flex items-center gap-3">
          <img
            src="/logo-icon.png"
            alt="SouthMindly"
            width={198}
            height={246}
            className={`h-10 w-auto object-contain transition-transform duration-500 ${
              isSuccessAnimating ? 'rotate-6 scale-110' : 'rotate-0 scale-100'
            }`}
          />
          <div className="leading-tight">
            <div className="text-xs font-mono text-[#6B7280] tracking-[0.14em] uppercase">
              SouthMindly Docs
            </div>
            <div className="text-lg font-semibold">
              {mode === 'signin' ? 'Entrar' : 'Criar conta'}
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              disabled={isBusy}
              autoComplete="email"
              className="w-full rounded-lg border border-[#1E2130] bg-[#191C25] px-3.5 py-2.5 text-sm font-sans text-[#E8EAF0] outline-none placeholder:text-[#6B7280] placeholder:opacity-55 focus:border-[#7C3AED]"
              style={{
                boxShadow: `0 0 0 0 ${INPUT_ACCENT_RING}`,
              }}
              placeholder="voce@empresa.com"
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${INPUT_ACCENT_RING}`;
                e.currentTarget.style.borderColor = INPUT_ACCENT;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
                e.currentTarget.style.borderColor = '#1E2130';
              }}
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-[0.12em] uppercase mb-1.5 text-[#6B7280]">
              Senha
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              disabled={isBusy}
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              className="w-full rounded-lg border border-[#1E2130] bg-[#191C25] px-3.5 py-2.5 text-sm font-sans text-[#E8EAF0] outline-none placeholder:text-[#6B7280] placeholder:opacity-55 focus:border-[#7C3AED]"
              style={{
                boxShadow: `0 0 0 0 ${INPUT_ACCENT_RING}`,
              }}
              placeholder="••••••••"
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 3px ${INPUT_ACCENT_RING}`;
                e.currentTarget.style.borderColor = INPUT_ACCENT;
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
                e.currentTarget.style.borderColor = '#1E2130';
              }}
            />
          </div>

          {error && (
            <div className="text-xs text-[#F87171] bg-[#F8717118] border border-[#F8717133] rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="ghost"
            disabled={isBusy}
            className="h-11 w-full rounded-xl bg-[#7C3AED] text-sm font-medium text-white transition-all hover:bg-[#7C3AED] hover:text-white disabled:opacity-100"
          >
            {isSuccessAnimating ? (
              <>
                <Sparkles className="size-4" />
                Entrando no sistema...
              </>
            ) : submitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                Aguarde...
              </>
            ) : mode === 'signin' ? (
              <>
                Entrar
                <ArrowRight className="size-4" />
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between text-xs text-[#6B7280]">
          <div className="font-mono tracking-[0.12em] uppercase">
            {mode === 'signin' ? 'Não tem conta?' : 'Já tem conta?'}
          </div>
          <Button
            type="button"
            variant="ghost"
            disabled={isBusy}
            onClick={() => {
              setError(null);
              setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
            }}
            className="text-[#7C3AED] hover:bg-transparent hover:text-[#A78BFA] disabled:opacity-50"
          >
            {mode === 'signin' ? 'Criar conta' : 'Entrar'}
          </Button>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-all duration-500 ${
          isSuccessAnimating ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="rounded-full border border-[#7C3AED44] bg-[#7C3AED18] px-5 py-3 text-sm font-medium text-[#EDE9FE] shadow-[0_20px_60px_rgba(124,58,237,0.22)] backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Preparando seu dashboard...
          </div>
        </div>
      </div>
    </div>
  );
}
