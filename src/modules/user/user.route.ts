import { Router } from "express";
import { UserController } from "./user.controller";
const router = Router();

router.post("/add-user", UserController.addUser);
router.get("/all-users", UserController.getAllUser);
router.get("/user/:id", UserController.singleuser);
router.patch("/user-update/:id", UserController.updateUser);
router.delete("/delete-user/:id", UserController.deletUser);

export const UserRoute = router;
