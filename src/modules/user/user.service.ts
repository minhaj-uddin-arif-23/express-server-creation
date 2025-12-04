import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
interface IUser {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
}
// { name, email, age, phone, address }: IUser airkm dibo nh karon req.body te aro data
//  aste pare
const createUser = async (paload: Record<string, unknown>) => {
  const { name, email, role, password } = paload;
  // password logic here
  const hashedPassword = await bcrypt.hash(password as string, 10);
  const insetUser = await pool.query(
    `
            INSERT INTO users (name, email,role, password )
            VALUES($1,$2,$3,$4)
            RETURNING *
          `,
    [name, email, role, hashedPassword]
  );
  return insetUser;
};

const getAllUser = async () => {
  const result = await pool.query(`
      SELECT name,email,role FROM users ORDER BY CREATED_AT ASC
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
// export for usercontroller
export const UserService = {
  createUser,
  getAllUser,
  singleUser,
  updateUser,
  deleteUser,
};
