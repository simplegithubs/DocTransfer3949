import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@clerk') || id.includes('@supabase')) {
              return 'vendor-auth';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('pdfjs-dist') || id.includes('canvas')) {
              return 'vendor-pdf';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            return 'vendor-libs';
          }
          if (id.includes('src/data/seo-pages') || id.includes('src/data/seoPages') || id.includes('src/data/seoExpandedContent')) {
            return 'seo-data';
          }
        }
      }
    }
  },
})
