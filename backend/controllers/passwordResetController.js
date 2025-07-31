const pool = require('../db');
const bcrypt = require('bcrypt');
const { sendOTPEmail } = require('../utils/mailer');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendResetOTP = async (req, res) => {
  const { email } = req.body;
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userResult.rows.length === 0) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const otp = generateOtp();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await pool.query(
    'UPDATE users SET reset_otp = $1, reset_otp_expires = $2 WHERE email = $3',
    [otp, expires, email]
  );

  await sendOTPEmail(email, otp);
  res.json({ msg: 'OTP sent to email' });
};

exports.verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

  if (userResult.rows.length === 0) {
    return res.status(404).json({ msg: 'User not found' });
  }

  const user = userResult.rows[0];

  if (user.reset_otp !== otp || new Date() > new Date(user.reset_otp_expires)) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  res.json({ msg: 'OTP verified' });
};

exports.resetPassword = async (req, res) => {
  console.log('🔥 resetPassword endpoint hit');

  try {
    const { email, newPassword } = req.body;
    console.log('📨 Payload received:', { email, newPassword });

    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('🔍 User lookup result:', userResult.rows);

    if (userResult.rows.length === 0) {
      console.log('🚫 User not found');
      return res.status(404).json({ msg: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log('🔐 Hashed password:', hashedPassword);

    await pool.query(
      'UPDATE users SET password_hash = $1, reset_otp = NULL, reset_otp_expires = NULL WHERE email = $2',
      [hashedPassword, email]
    );


    console.log('✅ Password reset successful for', email);
    res.json({ msg: 'Password reset successful' });

  } catch (err) {
    console.error('🔥 Error in resetPassword:', err); // <- This should now log something useful
    res.status(500).json({ error: 'Something went wrong' });
  }
};

