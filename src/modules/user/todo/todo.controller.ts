import { Request, Response } from "express";
import { pool } from "../../../config/db";
import { TodoService } from "./todo.service";

const addTodo = async (req: Request, res: Response) => {
  try {
    const result = await TodoService.addTodo(req.body);
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
};
//  get all todo
const gettAllTodo = async (req: Request, res: Response) => {
  try {
    const result = await TodoService.getAllTodo();
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
};

// single todo get "",
const getSingleTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // 1

    if (isNaN(Number(id))) {
      res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const todoResult = await TodoService.getSingleTodo(id as string);
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
};

// update particular  user todo  data

const updateTodo = async (req: Request, res: Response) => {
  try {
    const { userId, todoId } = req.params; // 1

    if (isNaN(Number(userId)) || isNaN(Number(todoId))) {
      return res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const singleUserUpdate = await TodoService.updateTodo(
      req.body,
      userId as string,
      todoId as string
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
};

//  delete particular user todo post
// delete single user data
const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { userId, todoId } = req.params; // 1

    if (isNaN(Number(userId)) || isNaN(Number(todoId))) {
      return res.status(400).json({
        message: "please provide a valide user id",
      });
    }
    const singleUser = await TodoService.deleteTodo(
      userId as string,
      todoId as string
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
};
//  export for todo routes
export const TodoController = {
  addTodo,
  gettAllTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
