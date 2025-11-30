import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
const app = express();
const port = 5000;
dotenv.config({ path: path.join(process.cwd(), ".env") });
app.use(express.json()); // Middleware processes requests before routes
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_URI}`,
});
// database a table creation
const initDB = async () => {
  await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(25) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(50),
        address TEXT,
        CREATED_AT TIMESTAMP DEFAULT NOW(),
        UPDATED_AT TIMESTAMP DEFAULT NOW()
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
        CREATED_AT TIMESTAMP DEFAULT NOW(),
        UPDATED_AT TIMESTAMP DEFAULT NOW()
      )`);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello Express Js " });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
