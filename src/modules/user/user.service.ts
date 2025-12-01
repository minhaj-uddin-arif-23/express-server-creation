import { pool } from "../../config/db";

interface IUser {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
}

const createUser = async ({ name, email, age, phone, address }: IUser) => {
  const insetUser = await pool.query(
    `
            INSERT INTO users (name, email, age, phone, address)
            VALUES($1,$2,$3,$4,$5)
            RETURNING *
        `,
    [name, email, age, phone, address]
  );
  return insetUser;
};

const getAllUser = async () => {
  const result = await pool.query(`
      SELECT * FROM users ORDER BY CREATED_AT ASC
      `);
  return result;
};

const singleUser = async (id: string) => {
  const singleUser = await pool.query(`SELECT * FROM users where id = $1`, [
    id,
  ]);
  return singleUser;
};

const updateUser = async (
  { name, email, age, phone, address }: IUser,
  id: string
) => {
  const singleUserUpdate = await pool.query(
    `UPDATE users SET name=$1, email=$2, age=$3, phone=$4 ,address=$5 where id=$6 RETURNING*`,
    [name, email, age, phone, address, id]
  );
  return singleUserUpdate;
};

const deleteUser = async (id: string) => {
  const singleUser = await pool.query(`DELETE FROM users where id = $1`, [id]);
  return singleUser;
};

export const UserService = {
  createUser,
  getAllUser,
  singleUser,
  updateUser,
  deleteUser,
};
