// env config
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  connection_uri: process.env.CONNECTION_URI,
  port: process.env.PORT,
};
export default config;
