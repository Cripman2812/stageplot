import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages & Capacitor friendly
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
  },
  server: {
    host: true,
    port: 5173,
  },
})
