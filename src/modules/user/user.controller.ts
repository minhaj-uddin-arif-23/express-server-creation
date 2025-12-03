import { Request, Response } from "express";
import { pool } from "../../config/db";
import { UserService } from "./user.service";

// post a user
const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({
        message: "name email and password required",
      });
    }
    // send buisness logic
    const insetUser = await UserService.createUser(req.body);
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
        error: error.detail,
        message: "Another email Try, this account already exists.",
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
    const result = await UserService.getAllUser();
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
    const singleUser = await UserService.singleUser(id as string);
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
    const { id } = req.params; // 1

    if (isNaN(Number(id))) {
      res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const singleUserUpdate = await UserService.updateUser(
      req.body,
      id as string
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
    const singleUser = await UserService.deleteUser(id as string);
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
  deletUser,
};
