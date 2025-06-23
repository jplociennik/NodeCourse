require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    databaseConnectionString: process.env.DATABASE || 'mongodb://localhost:27017/node',
    url: process.env.URL || 'http://localhost'
}