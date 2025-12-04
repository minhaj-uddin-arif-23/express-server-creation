// * 👉  higher order function It checks if a user is authenticated by verifying a JWT token before allowing access to a route.

import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/env";
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.authorization;
      if (!token) {
        return res.status(404).json({
          success: false,
          message: "you are not authenticated",
        });
      }
      // Verifies token integrity
      const secret = config.jwt_secret;
      const decodeToken = jwt.verify(token, secret as string) as JwtPayload;
      // console.log({ decodeToken: decodeToken });
      req.user = decodeToken;
      // roles check
      if (roles.length > 0 && !roles.includes(decodeToken.role)) {
        return res.status(403).json({
          success: false,
          error: "forbidden",
        });
      }
      console.log(req.user);
      next();
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: error?.message || "Not Validated",
      });
    }
  };
};

export default auth;
