import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/chat': { target: 'http://localhost:3333', changeOrigin: true },
      '/auth': { target: 'http://localhost:3333', changeOrigin: true },
      '/message': { target: 'http://localhost:3333', changeOrigin: true }
    },
    configureServer({ app }) {
      app.use((req, res, next) => {
        if (req.url === '/auth' || req.url === '/') {
          req.url = '/index.html';
        }
        next();
      });
    }
  }
})