// higher order function
// * 👉 It checks if a user is authenticated by verifying a JWT token before allowing access to a route.

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";
const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "you are not authenticated",
      });
    }
    // Verifies token integrity
    const secret = config.jwt_secret;
    const decodeToken = jwt.verify(token, secret as string);
    console.log(decodeToken);
    next();
  };
};

export default auth;
