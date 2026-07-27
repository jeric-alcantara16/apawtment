require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'bxvl0imfammnkqd6ju3q-mysql.services.clever-cloud.com',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'ufkqa8gukkjv6agu',
    password: process.env.DB_PASSWORD || 'DqZHDkL55PlXyV3OX0Fh',
    database: process.env.DB_NAME || 'bxvl0imfammnkqd6ju3q',
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true // keep DATETIME as 'YYYY-MM-DD HH:MM:SS' strings, not JS Date objects
});

module.exports = pool;