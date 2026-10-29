import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [react()],
  build: {
    outDir: 'dist-embed',
    lib: { entry: 'src/embed.tsx', formats: ['es'], fileName: () => 'knowledge.js', cssFileName: 'knowledge' },
  },
});
