import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/-VI/',
  build: { rollupOptions: { input: { main: resolve(import.meta.dirname,'index.html'), review: resolve(import.meta.dirname,'review.html') } } },
});

