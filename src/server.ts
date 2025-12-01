import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { initDB } from "./config/db";
import config from "./config/env";

(async () => {
  try {
    await initDB();

    app.listen(config.port, () => {
      console.log(` Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error(" Server failed to start", error);
  }
})();
