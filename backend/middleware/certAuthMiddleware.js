const pool = require('../db');

const certAuthMiddleware = async (req, res, next) => {

  console.log('---- Incoming Headers ----');
  console.log('x-ssl-verify:', req.headers['x-ssl-verify']);
  console.log('x-ssl-subject:', req.headers['x-ssl-subject']);

  const sslVerify = req.headers['x-ssl-verify'];
  console.log(sslVerify);  // Should print: CN=..., emailAddress=...

  const subject = req.headers['x-ssl-subject'];
  console.log('x-ssl-subject:', subject);

  if (sslVerify !== 'SUCCESS' || !subject) {
    return res.status(403).json({ error: 'Invalid or missing client certificate' });
  }

  // Extract email from subject: e.g., "CN=Archit,OU=Admin,emailAddress=architagarwal.wrk@gmail.com"
  const emailMatch = subject.match(/emailAddress=([^,\/\n]+)/i);
  if (!emailMatch) {
    return res.status(403).json({ error: 'Email not found in certificate' });
  }

  const email = emailMatch[1];

  try {
    // Look up the user in DB
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, 'admin']
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: 'Admin not recognized or inactive' });
    }

    // Mimic JWT-auth format
    
    req.user = rows[0];
    next();
    
  } catch (err) {
    console.error('Certificate auth error:', err);
    res.status(500).json({ error: 'Server error during certificate auth' });
  }
};

module.exports = certAuthMiddleware;
