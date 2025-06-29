CREATE TABLE security_logs (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,           -- e.g. LOGIN_FAIL, VALIDATION_ERROR
  message TEXT NOT NULL,
  meta JSONB,                          -- optional metadata: userId, IP, path
  timestamp TIMESTAMP DEFAULT NOW()
);