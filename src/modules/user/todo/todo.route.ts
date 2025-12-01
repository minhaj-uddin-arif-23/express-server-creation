import { Router } from "express";
import { TodoController } from "./todo.controller";
const router = Router();

router.post("/add-todo", TodoController.addTodo);
router.get("/all-todo", TodoController.gettAllTodo);
router.get("/users/:id/todo", TodoController.getSingleTodo);
router.patch("/users/:userId/todos/:todoId", TodoController.updateTodo);
router.delete("/users/:userId/todos/:todoId", TodoController.deleteTodo);

export const TodoRoutes = router;
