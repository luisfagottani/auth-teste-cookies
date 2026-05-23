import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Raiz ao usar domínio customizado app.agottani.dev no GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/',
});
