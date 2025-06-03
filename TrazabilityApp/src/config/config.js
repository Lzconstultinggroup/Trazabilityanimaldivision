// src/config/config.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/trazability',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key'
};
