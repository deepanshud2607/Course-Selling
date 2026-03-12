import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { // forward api calls to the express backend
      '/user':    'http://localhost:3000',
      '/admin':   'http://localhost:3000',
      '/courses': 'http://localhost:3000',
    },
  },
});
