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

const getAllTodo = async () => {
  const result = await pool.query(`SELECT * FROM toDo`);
  return result;
};

const getSingleTodo = async (id: string) => {
  const todoResult = await pool.query(`SELECT * FROM toDo where user_id = $1`, [
    id,
  ]);
  return todoResult;
};
const updateTodo = async (
  { user_id, title, description, completed, due_date }: ITodo,
  userId: string,
  todoId: string
) => {
  const singleUserUpdate = await pool.query(
    `UPDATE toDo SET title=$1, description=$2 where id=$3 and user_id=$4 RETURNING *`,
    [title, description, todoId, userId]
  );
  return singleUserUpdate;
};
const deleteTodo = async (userId: string, todoId: string) => {
  const singleUser = await pool.query(
    `DELETE FROM toDo where id = $1 and user_id=$2`,
    [todoId, userId]
  );
  return singleUser;
};

export const TodoService = {
  addTodo,
  getAllTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
