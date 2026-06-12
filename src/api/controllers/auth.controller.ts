import { signToken } from "../../utils/jwt";
import { sendRespons } from "../../utils/sendRespons";
import authService from "../service/auth.service";
import type { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);
  if (!user) {
    sendRespons(res, { message: "Failed to create user" }, 400);
    return;
  }
  sendRespons(
    res,
    { message: "User registered successfully", data: user },
    201,
  );
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await authService.ValidateUser(email, password);
  if (!user) {
    sendRespons(res, { message: "Invalid email or password" }, 401);
    return;
  }

  const token = signToken({
    id: user.id,
    name: user.name,
    role: user.role,
  });

  const result = {
    token,
    user: user,
  };

  return sendRespons(res, { message: "Login successful", data: result }, 200);
};
