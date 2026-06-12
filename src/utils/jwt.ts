import config from "../config";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  name: string;
  role: string;
}

export const signToken = (payload: TokenPayload) => {
  return jwt.sign(payload, config.jwt_secret, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, config.jwt_secret);
  } catch (error) {
    return null;
  }
};
