require('dotenv').config();
const mysql = require('mysql2/promise');

// Create a connection pool
// This prevents the database from disconnecting after long periods of inactivity
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = { db }