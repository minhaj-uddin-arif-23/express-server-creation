// *-------------------------- Combine all routes
import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { TodoRoutes } from "../modules/user/todo/todo.route";
import { AuthRouter } from "../modules/auth/auth.routes";
const router = Router();

router.use("/users", UserRoute);
router.use("/todo", TodoRoutes);
router.use("/auth", AuthRouter);

export default router;
