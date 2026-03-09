'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/browser';

type Mode = 'signin' | 'signup';

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
    <div className="min-h-screen bg-[#0D0F14] text-[#E8EAF0] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#13161D] border border-[#1E2130] rounded-2xl p-7 shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo-icon.png" alt="SouthMindly" className="w-10 h-10" />
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
              className="w-full bg-[#191C25] border border-[#1E2130] rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none placeholder:text-[#6B7280] placeholder:opacity-55 focus:border-[#4F7EFF]"
              placeholder="voce@empresa.com"
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
              className="w-full bg-[#191C25] border border-[#1E2130] rounded-lg px-3.5 py-2.5 text-[#E8EAF0] text-sm font-sans outline-none placeholder:text-[#6B7280] placeholder:opacity-55 focus:border-[#4F7EFF]"
              placeholder="••••••••"
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
            className="w-full h-11 rounded-xl bg-[#4F7EFF] text-white font-medium text-sm transition-opacity disabled:opacity-60 hover:bg-[#4F7EFF] hover:text-white"
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
            className="text-[#A78BFA] hover:text-[#C4B5FD] hover:bg-transparent"
          >
            {mode === 'signin' ? 'Criar conta' : 'Entrar'}
          </Button>
        </div>
      </div>
    </div>
  );
}
