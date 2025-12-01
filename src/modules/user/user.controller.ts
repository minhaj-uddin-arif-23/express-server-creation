import { Request, Response } from "express";
import { pool } from "../../config/db";

// post a user
const addUser = async (req: Request, res: Response) => {
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
};

const getAllUser = async (req: Request, res: Response) => {
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
};
// get single user data
const singleuser = async (req: Request, res: Response) => {
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
};

// update user data
const updateUser = async (req: Request, res: Response) => {
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
};

// delete single user
const deletUser = async (req: Request, res: Response) => {
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
};

// * export for route file
export const UserController = {
  addUser,
  getAllUser,
  singleuser,
  updateUser,
  deletUser
};
