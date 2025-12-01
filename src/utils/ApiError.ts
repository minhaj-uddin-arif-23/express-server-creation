import { Request, Response, Router } from "express";

export const notFoundRouter = Router();
notFoundRouter.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});
