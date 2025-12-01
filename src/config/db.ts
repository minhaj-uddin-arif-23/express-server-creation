// postgresql connection
import { Pool } from "pg";
import dotenv from "dotenv";
import config from "./env";
dotenv.config();
export const pool = new Pool({
  connectionString: config.connection_uri as string,
});

export const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(25) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(50),
        address TEXT,
        CREATED_AT TIMESTAMP  DEFAULT NOW(),
        UPDATED_AT TIMESTAMP   DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS toDo(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(50) NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        due_date DATE,
        CREATED_AT TIMESTAMP  DEFAULT NOW(),
        UPDATED_AT TIMESTAMP   DEFAULT NOW()
      )`);
    console.log("Database tables initialize");
  } catch (error) {
    console.log("Database initialization failed", error);
    process.exit(1);
  }
};
