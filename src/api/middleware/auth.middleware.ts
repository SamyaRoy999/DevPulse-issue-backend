import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../../utils/jwt";
import { sendRespons } from "../../utils/sendRespons";

interface UserPayload {
  id: number;
  name: string;
  role: string;
}

export interface CustomRequest extends Request {
  user?: UserPayload | undefined;
}

export const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendRespons(res, { message: "Unauthorized access" }, 401);
    return;
  }

  const token = authHeader.split(" ")[1] as string;

  const decoded = verifyToken(token);

  if (!decoded) {
    sendRespons(res, { message: "Invalid or expired token" }, 401);
    return;
  }

  req.user = decoded as unknown as UserPayload;
  next();
};
