/**
 * Database Connection Pool
 * Description: Creates and exports a MySQL2 promise-based connection pool.
 *              Verifies connectivity on startup.
 * Author: SchoolMap Dev Team
 * Date: 2026-05-10
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host:     process.env.DB_HOST || 'localhost',
  user:     process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'school_management',
  port:     parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

const verifyConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('[DB] ✓ MySQL connection pool established');
    connection.release();
  } catch (err) {
    console.error('[DB] ✗ Connection failed:', err.message);
    process.exit(1);
  }
};

verifyConnection();

module.exports = pool;
