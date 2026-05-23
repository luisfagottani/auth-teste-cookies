# auth-teste-cookies

App React (Vite) para GitHub Pages em **app.agottani.dev**: lê `?referral_id=` na URL e grava cookie `referral_id` com `Domain=.agottani.dev` quando o site é servido em qualquer host `*.agottani.dev`.

## Desenvolvimento

```bash
npm install
npm run dev
```

Teste local: acesse algo como `http://localhost:5173/?referral_id=teste-local`. Em localhost o cookie **não** usa `Domain=.agottani.dev` (limitação dos navegadores).

## Produção no GitHub Pages

1. Repositório → **Settings** → **Pages** → Source: **GitHub Actions**.
2. Faça push na branch `main` ou `master`. O workflow publica `dist/` e copia `public/CNAME` (domínio customizado já apontando para Pages).

Para validar o cookie entre subdomínios: abra `https://app.agottani.dev/?referral_id=algo` e verifique nas DevTools (Application → Cookies) o domínio do cookie `.agottani.dev`.

Um URL em `*.github.io` não é um host válido para definir cookie com `Domain=.agottani.dev`; para “os dois cenários”, use localhost (cookie só na origem) e o deploy em **app.agottani.dev**.
