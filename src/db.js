require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'apawtment_bugtracker',
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true // keep DATETIME as 'YYYY-MM-DD HH:MM:SS' strings, not JS Date objects
});

module.exports = pool;