/*const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
*/

const fs = require('fs');
const https = require('https');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;

// Load SSL certificate and key
const privateKey = fs.readFileSync('./certs/cert-key.pem', 'utf8');
const certificate = fs.readFileSync('./certs/cert.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

// Create HTTPS server
https.createServer(credentials, app).listen(PORT, () => {
  console.log(`HTTPS Server is running on https://localhost:${PORT}`);
});
//
