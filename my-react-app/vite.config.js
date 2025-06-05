import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync('/app/certs/cert-key.pem'),
      cert: fs.readFileSync('/app/certs/cert.pem')
    }
  }
});
// This configuration sets up Vite to use React and enables HTTPS with the specified certificate and key files.

