import { pool } from "../../../config/db";

interface ITodo {
  user_id: number;
  title: string;
  description: string;
  completed: boolean;
  due_date: Date;
}

const addTodo = async ({
  user_id,
  title,
  description,
  completed,
  due_date,
}: ITodo) => {
  const result = await pool.query(
    `
          INSERT INTO toDo (user_id, title, description, completed,due_date)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *`,
    [user_id, title, description, completed, due_date]
  );
  return result;
};

const getAllTodo = async () => {};

const getSingleTodo = async () => {};
const updateTodo = async () => {};
const deleteTodo = async () => {};

export const TodoService = {
  addTodo,
  getAllTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
