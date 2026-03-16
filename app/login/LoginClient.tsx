'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type Mode = 'signin' | 'signup';
const INPUT_ACCENT = '#7C3AED';
const INPUT_ACCENT_RING = 'rgba(124, 58, 237, 0.22)';

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/dashboard';

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result =
        mode === 'signin'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D0F14] p-6 text-[#E8EAF0]">
      <div className="w-full max-w-md rounded-2xl border border-[#1E2130] bg-[#13161D] p-7 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/logo-icon.png"
            alt="SouthMindly"
            width={198}
            height={246}
            className="h-10 w-auto object-contain"
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
            disabled={submitting}
            className="h-11 w-full rounded-xl bg-[#7C3AED] text-sm font-medium text-white transition-opacity hover:bg-[#7C3AED] hover:text-white disabled:opacity-60"
          >
            {submitting
              ? 'Aguarde...'
              : mode === 'signin'
                ? 'Entrar'
                : 'Criar conta'}
          </Button>
        </form>

        <div className="mt-5 flex items-center justify-between text-xs text-[#6B7280]">
          <div className="font-mono tracking-[0.12em] uppercase">
            {mode === 'signin' ? 'Não tem conta?' : 'Já tem conta?'}
          </div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setError(null);
              setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
            }}
            className="text-[#7C3AED] hover:bg-transparent hover:text-[#A78BFA]"
          >
            {mode === 'signin' ? 'Criar conta' : 'Entrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
