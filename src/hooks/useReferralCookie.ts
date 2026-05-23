import { useEffect, useMemo, useState } from 'react';

const COOKIE_NAME = 'referral_id';

/** Hosts em que vale Domain=.agottani.dev (subdomínios compartilham o cookie). */
function cookieDomainAttribute(hostname: string): string | null {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h === '127.0.0.1') {
    return null;
  }
  if (h === 'agottani.dev' || h.endsWith('.agottani.dev')) {
    return '.agottani.dev';
  }
  return null;
}

function parseCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function setReferralCookie(value: string, maxAgeDays: number): void {
  const hostname = window.location.hostname;
  const domain = cookieDomainAttribute(hostname);
  const maxAge = Math.floor(maxAgeDays * 24 * 60 * 60);

  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax',
  ];

  if (window.location.protocol === 'https:' || hostname === 'localhost') {
    parts.push('Secure');
  }

  if (domain) {
    parts.push(`Domain=${domain}`);
  }

  document.cookie = parts.join('; ');
}

export type UseReferralCookieResult = {
  /** Valor encontrado na query (?referral_id=) na primeira renderização/sync. */
  referralIdFromQuery: string | null;
  /** Valor atual do cookie referral_id após aplicar (ou já existente). */
  referralIdInCookie: string | null;
  /** Se existe parâmetro na URL e gravamos/atualizamos o cookie nesta sessão. */
  capturedFromUrl: boolean;
};

/**
 * Lê `referral_id` da query na home e define cookie para `.agottani.dev`
 * quando o site roda sob agottani.dev (inclui auth.agottani.dev).
 * Em localhost não usa Domain (cookie só vale na origem atual).
 */
export function useReferralCookie(
  paramName = 'referral_id',
  options: { maxAgeDays?: number } = {},
): UseReferralCookieResult {
  const maxAgeDays = options.maxAgeDays ?? 30;

  const fromQuery = useMemo(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(paramName)?.trim();
    return raw ? raw : null;
  }, [paramName]);

  const [referralIdInCookie, setReferralIdInCookie] = useState<string | null>(() =>
    typeof document !== 'undefined' ? parseCookie(COOKIE_NAME) : null,
  );
  const [capturedFromUrl, setCapturedFromUrl] = useState(false);

  useEffect(() => {
    const existing = parseCookie(COOKIE_NAME);

    if (fromQuery) {
      setReferralCookie(fromQuery, maxAgeDays);
      setReferralIdInCookie(fromQuery);
      setCapturedFromUrl(true);
    } else if (existing) {
      setReferralIdInCookie(existing);
    } else {
      setReferralIdInCookie(null);
    }
  }, [fromQuery, maxAgeDays]);

  return {
    referralIdFromQuery: fromQuery,
    referralIdInCookie,
    capturedFromUrl,
  };
}
