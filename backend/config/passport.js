const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../db');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    try {
      // Check if user exists
      const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

      if (userRes.rows.length === 0) {
        // Create new user with default role 'student'
        const newUser = await pool.query(`
          INSERT INTO users (name, email, password_hash, role)
          VALUES ($1, $2, '', 'student')
          RETURNING user_id, name, email, role
        `, [name, email]);
        console.log('🔁 Google OAuth user:', newUser.rows[0]);

        return done(null, newUser.rows[0]);
      } else {
        return done(null, userRes.rows[0]);
      }

    } catch (err) {
      return done(err, null);
    }
  }
));

module.exports = passport;
