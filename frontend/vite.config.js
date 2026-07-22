import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = process.env.VERCEL === '1';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],
  define: {
    // On Vercel: force the API base to the Render backend.
    // Locally: let import.meta.env.VITE_API_URL fall through (empty = Vite proxy).
    'import.meta.env.VITE_API_URL': isVercel
      ? JSON.stringify('https://amazonclone-hnlb.onrender.com')
      : 'import.meta.env.VITE_API_URL',
  },
  build: {
    // Vercel: use default 'dist' in frontend/
    // Docker/single-server: output to ../backend/dist for Express to serve
    outDir: isVercel
      ? 'dist'
      : path.resolve(__dirname, '../backend/dist'),
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  base: '/',
});
