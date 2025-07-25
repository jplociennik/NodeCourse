require('dotenv').config();

module.exports = {
    env: process.env.NODE_ENV || 'dev',
    port: process.env.PORT || 3000,
    databaseConnectionString: process.env.DATABASE || 'mongodb://localhost:27017/node',
    url: process.env.URL || 'http://localhost',
    sessionKeySecret: process.env.SESSION_KEY_SECRTET || 'secretKey'
}