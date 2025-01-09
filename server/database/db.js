import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // password:'w*3SB4@h2%h$#Z7',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection function
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Successfully connected to database");
    connection.release();
    return true;
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
}

// Main query function
export async function query(command, values = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.query(command, values);
    return results;
  } catch (error) {
    console.error("Query execution failed:", {
      command,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Get connection for transactions
export async function getConnection() {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error("Failed to get database connection:", error.message);
    throw error;
  }
}

// Graceful shutdown function
export async function closePool() {
  try {
    await pool.end();
    console.log("Database pool closed successfully");
  } catch (error) {
    console.error("Error closing database pool:", error.message);
    throw error;
  }
}

export default {
  query,
  getConnection,
  testConnection,
  closePool
};