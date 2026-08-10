import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Palimpsest/',
  // Keep the existing repository asset tree exactly where it is.
  // Vite will copy assets/ into dist/ during production builds.
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
