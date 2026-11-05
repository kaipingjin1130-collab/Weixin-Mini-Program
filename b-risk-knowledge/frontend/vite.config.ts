import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: '/quality/b/',
  plugins: [react()],
  server: {
    host: '127.0.0.1', port: 5181, strictPort: true,
    proxy: { '/api': loadEnv(mode, '.', 'B_API_').B_API_TARGET || 'http://127.0.0.1:8181' }
  }
}));
