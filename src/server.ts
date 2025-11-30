import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { Pool } from "pg";
const app = express();
const port = process.env.PORT || 5000;
dotenv.config({ path: path.join(process.cwd(), ".env") });
app.use(express.json()); // Middleware processes requests before routes

// validate db connections

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_URI}`,
});

// database a table creation
const initDB = async () => {
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

initDB();

// app.get("/", (req: Request, res: Response) => {
//   res.send({ message: "Hello Express Js " });
// });

// post a user

app.post("/add-user", async (req: Request, res: Response) => {
  try {
    const { name, email, age, phone, address } = req.body;
    if (!name || !email) {
      res.status(400).json({
        message: "name and email required",
      });
    }
    // insert database
    const insetUser = await pool.query(
      `
          INSERT INTO users (name, email, age, phone, address)
          VALUES($1,$2,$3,$4,$5)
          RETURNING *
      `,
      [name, email, age, phone, address]
    );
    if (insetUser.rowCount === 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    console.log("insetUser -> ", insetUser.rows[0]);
    res.status(201).json({
      success: true,
      message: insetUser.rows[0],
    });
  } catch (error: any) {
    console.log("somthing went wrong", error);
    if (error.code === "23505") {
      res.status(401).json({
        message: "Duplicate email found",
      });
    }
    res.status(401).json({
      success: false,
      message: "user not created successfully",
    });
  }
});

// get all user
app.get("/get-all-user", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users ORDER BY CREATED_AT ASC
      `);
    res.status(200).json({
      success: true,
      count: result.rowCount,
      message: "All user data",
      user: result.rows,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "fetch all user data",
    });
  }
});

// * post a todo

app.post("/add-toDo", async (req: Request, res: Response) => {
  try {
    const { user_id, title, description, completed, due_date } = req.body;
    const result = await pool.query(
      `
        INSERT INTO toDo (user_id, title, description, completed,due_date)
          VALUES($1,$2,$3,$4,$5)
          RETURNING *`,
      [user_id, title, description, completed, due_date]
    );
    res.status(200).json({
      success: true,
      message: result.rows[0],
    });
    // console.log(result.rows[0]);
  } catch (error: any) {
    console.log(error?.message);
    res.status(400).json({
      success: false,
      message: "To do add something went wrong",
    });
  }
});
// * get all todo
app.get("/show-all-toDo", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM toDo`);
    res.status(200).json({
      success: true,
      count: result.rowCount,
      message: "All TODO DATA ",
      todo: result.rows,
    });
    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "fetch all user data",
    });
  }
});

//* single todo get
app.get("/users/:id/todo", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // 1

    if (isNaN(Number(id))) {
      res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const todoResult = await pool.query(
      `SELECT * FROM toDo where user_id = $1`,
      [id]
    );
    if (todoResult.rowCount === 0) {
      res.status(404).json({
        message: "todo not found",
      });
    }

    res.status(200).json({
      success: true,
      user: todoResult.rows,
    });
    console.log(todoResult.rows);
  } catch (error: any) {
    console.log(error?.message);
    res.status(400).json({
      success: false,
      message: "Not found todo",
    });
  }
});

// * update particular  user todo  data

app.put("/users/:userId/todos/:todoId", async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const { userId, todoId } = req.params; // 1

    if (isNaN(Number(userId)) || isNaN(Number(todoId))) {
      return res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const singleUserUpdate = await pool.query(
      `UPDATE toDo SET title=$1, description=$2 where id=$3 and user_id=$4 RETURNING *`,
      [title, description, todoId, userId]
    );
    if (singleUserUpdate.rowCount === 0) {
      return res.status(404).json({
        message: "todo not found",
      });
    }
    console.log("update todo -> ", singleUserUpdate.rows[0]);
    res.status(200).json({
      success: true,
      message: "Update TODO successfully",
      user: singleUserUpdate.rows[0],
    });
  } catch (error: any) {
    console.log(error?.message);
    res.status(400).json({
      success: false,
      error: error?.message,
      message: "Not found TODO",
    });
  }
});

// * delete particular user todo post
// delete single user data
app.delete(
  "/users/:userId/todos/:todoId",
  async (req: Request, res: Response) => {
    try {
      const { userId, todoId } = req.params; // 1

      if (isNaN(Number(userId)) || isNaN(Number(todoId))) {
        return res.status(400).json({
          message: "please provide a valide user id",
        });
      }
      const singleUser = await pool.query(
        `DELETE FROM toDo where id = $1 and user_id=$2`,
        [todoId, userId]
      );
      if (singleUser.rowCount === 0) {
        res.status(404).json({
          message: "todo not found",
        });
      }

      res.status(200).json({
        success: true,
        user: singleUser.rowCount,
        userdata: singleUser.rows[0],
        message: "Successfully delete Todo",
      });
    } catch (error: any) {
      console.log(error?.message);
      res.status(400).json({
        success: false,
        message: "something went wrong",
      });
    }
  }
);
// get single user data

app.get("/user/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // 1

    if (isNaN(Number(id))) {
      res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const singleUser = await pool.query(`SELECT * FROM users where id = $1`, [
      id,
    ]);
    if (singleUser.rowCount === 0) {
      res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user: singleUser.rows[0],
    });
  } catch (error: any) {
    console.log(error?.message);
    res.status(400).json({
      success: false,
      message: "Not found user",
    });
  }
});

// update user data

app.patch("/update-user/:id", async (req: Request, res: Response) => {
  try {
    const { name, email, age, phone, address } = req.body;
    const { id } = req.params; // 1

    if (isNaN(Number(id))) {
      res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const singleUserUpdate = await pool.query(
      `UPDATE users SET name=$1, email=$2, age=$3, phone=$4 ,address=$5 where id=$6 RETURNING*`,
      [name, email, age, phone, address, id]
    );
    if (singleUserUpdate.rowCount === 0) {
      res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Update user successfully",
      user: singleUserUpdate.rows[0],
    });
  } catch (error: any) {
    console.log(error?.message);
    res.status(400).json({
      success: false,
      error: error?.message,
      message: "Not found user",
    });
  }
});

// delete single user data
app.delete("/user-delete/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // 1

    if (isNaN(Number(id))) {
      res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const singleUser = await pool.query(`DELETE FROM users where id = $1`, [
      id,
    ]);
    if (singleUser.rowCount === 0) {
      res.status(404).json({
        message: "user not found",
      });
    }

    res.status(200).json({
      success: true,
      user: singleUser.rowCount,
      userdata: singleUser.rows,
      message: "Successfully delete",
    });
  } catch (error: any) {
    console.log(error?.message);
    res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function then(arg0: () => void) {
  throw new Error("Function not implemented.");
}
