import { NextFunction, Request, Response } from "express";

// custom middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log("you satify your requirment then you go next iteration");
  next();
};

export default logger;
