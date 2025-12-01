import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import { notFoundRouter } from "./utils/ApiError";

const app = express();

app.use(express.json()); // Middleware processes requests before routes
app.use(cors());

// root route : step router -> userRouter -> [ user.route.ts (final route )]
app.use("/api/v1", router);
// 404 not found route note -> always write down after compliting all routes
app.use(notFoundRouter);

export default app;
