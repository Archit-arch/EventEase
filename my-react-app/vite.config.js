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
    },
    hmr: {
      protocol: 'wss',
      host: 'eventease.centralindia.cloudapp.azure.com',
      port: 5173
    }
  },
  // Inject custom middleware
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' https://eventease.centralindia.cloudapp.azure.com:5173; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://eventease.centralindia.cloudapp.azure.com:5173 wss://eventease.centralindia.cloudapp.azure.com:5173; object-src 'none'; upgrade-insecure-requests; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; script-src-attr 'none';"
      );
      next();
    });
  }
});
// This configuration sets up Vite to use React and enables HTTPS with the specified certificate and key files.