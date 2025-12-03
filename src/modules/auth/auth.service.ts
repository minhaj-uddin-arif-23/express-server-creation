// login
/*
if user login check 
- email is already exist
- then compare password ,hashPassword
- check password is valid
then finaly jwt concept why because one single time user login then access more funtionality
*/

import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const loginUser = async (email: string, password: string) => {
  console.log({ email, password });
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);
  if (result.rows.length === 0) return "please register first";
  const user = result.rows[0]; //
  console.log({ user: user });
  const checkPassword = bcrypt.compare(password as string, user.password);
  if (!checkPassword) return "password doesn't match ";
  // generate secret token
  const secret_key =
    "G4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV";
  const token = jwt.sign({ email: email, password: password }, secret_key, {
    expiresIn: "7d",
  });
  console.log(token);
  return { token, user };
};

export const authService = {
  loginUser,
};
