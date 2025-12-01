import express, { Request, Response } from "express";
import cors from "cors";
import router from "./routes";

const app = express();

app.use(express.json()); // Middleware processes requests before routes
app.use(cors());

// root route
app.use("/api/v1", router);
// 404 not found route note -> always write down after compliting all routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
