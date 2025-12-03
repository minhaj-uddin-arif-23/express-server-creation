import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      message: "Login successful",
      count: result,
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const authController = {
  loginController,
};
