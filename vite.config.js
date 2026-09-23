import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        photos: resolve(__dirname, 'photos.html'),
        thoughts: resolve(__dirname, 'thoughts.html'),
        share: resolve(__dirname, 'share.html'),
      },
    },
  },
});
