import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/quality/b/',
  plugins: [react()],
  server: {
    host: '127.0.0.1', port: 5181, strictPort: true,
    proxy: { '/api': 'http://127.0.0.1:8181' }
  }
});
