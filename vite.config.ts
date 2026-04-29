import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Build optimizations ──────────────────────────────────────────
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Rolldown (Vite 8) requires manualChunks as a function
        manualChunks: (id: string) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor'
          }
          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor'
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion-vendor'
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) {
            return 'charts-vendor'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor'
          }
          if (id.includes('node_modules/@google/generative-ai')) {
            return 'gemini-vendor'
          }
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark')) {
            return 'markdown-vendor'
          }
        },
      },
    },
  },

  // ── Test configuration (Vitest 4.x) ─────────────────────────────
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    css: false,
    isolate: true,
    testTimeout: 15000,
    hookTimeout: 10000,
    // Vitest 4: top-level pool options
    maxWorkers: 1,
    minWorkers: 1,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/__tests__/**',
        'src/types/**',
        'src/main.tsx',
        'src/App.css',
      ],
    },
  },
})
