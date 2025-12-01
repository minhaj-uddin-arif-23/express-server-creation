// *-------------------------- Combine all routes
import { Router } from "express";
import { UserRoute } from "../modules/user/user.route";
import { TodoRoutes } from "../modules/user/todo/todo.route";
const router = Router();

router.use("/users", UserRoute);
router.use("/todo", TodoRoutes);

export default router;
