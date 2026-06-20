import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('openpgp')) {
              return 'openpgp';
            }
            if (id.includes('pdf-lib') || id.includes('pdfjs-dist')) {
              return 'pdf';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('@clerk')) {
              return 'clerk';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            return 'vendor';
          }
        }
      }
    }
  },
})
