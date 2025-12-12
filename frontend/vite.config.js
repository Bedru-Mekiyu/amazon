// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', { target: '19' }]],
      },
    }),
  ],

  // This makes Vite output directly into backend/dist
  build: {
    outDir: path.resolve(__dirname, '../backend/dist'), // Critical line
    emptyOutDir: true, // Deletes old files before building
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

  // Optional: nicer base for GitHub Pages or subfolders (keep '/' for now)
  base: '/',
});