const mysql = require('mysql2/promise');

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'oluwatobi@2002',
  database: process.env.DB_NAME || 'country_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Initialize database tables
async function initDatabase() {
  try {
    const connection = await pool.getConnection();

    // Create countries table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS countries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        capital VARCHAR(255),
        region VARCHAR(255),
        population BIGINT NOT NULL,
        currency_code VARCHAR(10),
        exchange_rate DECIMAL(20, 6),
        estimated_gdp DECIMAL(30, 2),
        flag_url TEXT,
        last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_region (region),
        INDEX idx_currency (currency_code),
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Create refresh status table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS refresh_status (
        id INT PRIMARY KEY DEFAULT 1,
        total_countries INT DEFAULT 0,
        last_refreshed_at TIMESTAMP NULL,
        CHECK (id = 1)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Initialize refresh status
    await connection.query(`
      INSERT IGNORE INTO refresh_status (id, total_countries, last_refreshed_at)
      VALUES (1, 0, NULL)
    `);

    connection.release();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

module.exports = {
  pool,
  initDatabase,
  testConnection
};