import dotenv from "dotenv";
dotenv.config(); 

import app from "./app";
import { initDB } from "./config/db";

const port = process.env.PORT || 5000;

(async () => {
  try {
    await initDB(); 

    app.listen(port, () => {
      console.log(` Server running on port ${port}`);
    });
  } catch (error) {
    console.error(" Server failed to start", error);
  }
})();
