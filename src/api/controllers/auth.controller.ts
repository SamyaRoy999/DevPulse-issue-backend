import { sendRespons } from "../../utils/sendRespons";
import authService from "../service/auth.service";
import type { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
  const user = await authService.createUser(req.body);
  if (!user) {
    sendRespons(res, { message: "Failed to create user" }, 400);
    return;
  }
  sendRespons(res, { message: "User create successfully", data: user }, 201);
};
