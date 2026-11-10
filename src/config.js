require('dotenv').config();

const port = Number.parseInt(process.env.PORT || '4001', 10);
const jwtSecret = process.env.JWT_SECRET || 'development-only-secret-change-me';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535');
}

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}

module.exports = {
  port,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  demoMember: {
    id: process.env.DEMO_MEMBER_ID || 'member-1',
    username: process.env.DEMO_MEMBER_USERNAME || 'member1',
    email: process.env.DEMO_MEMBER_EMAIL || 'member1@example.com',
    password: process.env.DEMO_MEMBER_PASSWORD || 'password123'
  }
};
