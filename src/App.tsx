import { useReferralCookie } from './hooks/useReferralCookie';

import './App.css';

export function App() {
  const host = typeof window !== 'undefined' ? window.location.host : '';
  const { referralIdFromQuery, referralIdInCookie, capturedFromUrl } =
    useReferralCookie();

  return (
    <main className="page">
      <h1>Teste referral + cookie</h1>
      <p className="muted">
        Origem atual: <code>{host}</code>
      </p>

      <section className="card">
        <h2>Estado</h2>
        <dl className="grid">
          <dt>referral_id na query</dt>
          <dd>
            <code>{referralIdFromQuery ?? '—'}</code>
          </dd>
          <dt>referral_id no cookie</dt>
          <dd>
            <code>{referralIdInCookie ?? '—'}</code>
          </dd>
          <dt>Vindo da URL neste load</dt>
          <dd>{capturedFromUrl ? 'sim' : 'não'}</dd>
        </dl>
      </section>

      <section className="card">
        <h2>Como testar</h2>
        <ul className="list">
          <li>
            <strong>Produção (app.agottani.dev):</strong> abra{' '}
            <code>?referral_id=XYZ</code>. O cookie deve ser definido com{' '}
            <code>Domain=.agottani.dev</code> e aparecer para outros subdomínios
            em HTTPS na mesma família de domínio.
          </li>
          <li>
            <strong>Local (<code>localhost</code>):</strong> mesmo fluxo da
            query — o cookie fica apenas na origem local (sem atributo Domain),
            porque o navegador não permite <code>.agottani.dev</code> partindo de
            outro registrable domain.
          </li>
          <li>
            <strong>Pages em github.io:</strong> usar{' '}
            <code>Domain=.agottani.dev</code> a partir do host github.io pode ser
            rejeitado; use o deploy no domínio customizado para validar cookie
            compartilhado.
          </li>
        </ul>
      </section>
    </main>
  );
}
