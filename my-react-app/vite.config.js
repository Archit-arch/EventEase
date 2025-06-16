// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import fs from 'fs';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     https: {
//       key: fs.readFileSync('/etc/nginx/certs/cert-key.pem'),
//       cert: fs.readFileSync('/etc/nginx/certs/cert.pem')
//     },
//     hmr: {
//       protocol: 'wss',
//       host: 'eventease.centralindia.cloudapp.azure.com',
//       port: 5173
//     }
//   },
//   // Inject custom middleware
//   configureServer(server) {
//     server.middlewares.use((req, res, next) => {
//       res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
//       res.setHeader(
//         'Content-Security-Policy',
//         "default-src 'self'; script-src 'self' 'unsafe-inline' https://eventease.centralindia.cloudapp.azure.com:5173; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://eventease.centralindia.cloudapp.azure.com:5173 wss://eventease.centralindia.cloudapp.azure.com:5173; object-src 'none'; upgrade-insecure-requests; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; script-src-attr 'none';"
//       );
  
//       res.setHeader('X-Content-Type-Options', 'nosniff'); //  Anti-MIME sniffing
//       res.setHeader('X-Frame-Options', 'DENY'); //  Prevent Clickjacking (or use CSP frame-ancestors)
//       res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin'); //  Leak protection
//       res.setHeader('X-XSS-Protection', '1; mode=block'); //  Legacy XSS protection (older browsers)
//       next();
//     });
//   }
// });
// // This configuration sets up Vite to use React and enables HTTPS with the specified certificate and key files.



// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // Listen on all interfaces
//     port: 5173,
//     hmr: {
//       protocol: 'wss',
//       host: 'eventease.centralindia.cloudapp.azure.com', // Or leave as undefined for auto
//       port: 5173
//     }
//   }

// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'certs/cert-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'certs/cert.pem')),
    },
    hmr: {
      protocol: 'wss',
      host: 'eventease.centralindia.cloudapp.azure.com',
      port: 5173,
    },
  },
});

