function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  if (error && typeof error === 'object' && 'message' in error) {
    const value = (error as { message?: unknown }).message;
    if (typeof value === 'string') return value;
  }

  return '';
}

function looksLikeHtmlDocument(value: string) {
  const normalized = value.trim();
  return (
    normalized.startsWith('<!DOCTYPE html') ||
    normalized.startsWith('<html') ||
    /<body[\s>]/i.test(normalized)
  );
}

export function formatSupabaseError(
  error: unknown,
  fallback = 'Erro ao comunicar com o Supabase',
) {
  const message = getErrorMessage(error);

  if (!message) {
    return fallback;
  }

  if (looksLikeHtmlDocument(message)) {
    const statusCode =
      message.match(/Error code\s*(\d{3})/i)?.[1] ??
      message.match(/\b(\d{3})\s*:\s*Bad gateway/i)?.[1];

    if (statusCode === '502' || /Bad gateway/i.test(message)) {
      return 'Supabase indisponível no momento (502 Bad Gateway). Tente novamente em alguns minutos.';
    }

    return 'Supabase retornou uma resposta inválida. Tente novamente em alguns minutos.';
  }

  return message;
}
