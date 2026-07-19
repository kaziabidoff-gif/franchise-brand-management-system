const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fbms'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fbms-development-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    cookieName: process.env.JWT_COOKIE_NAME || 'fbms_token'
  },
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'src/uploads')
};

module.exports = { env };
