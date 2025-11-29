import express, { Request, Response } from "express";
const app = express();
const port = 5000;

app.use(express.json()); // Middleware processes requests before routes

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Hello Express" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
