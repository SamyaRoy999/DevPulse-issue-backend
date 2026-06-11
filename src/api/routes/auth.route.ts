import { Router } from "express";
import { signup } from "../controllers/auth.controller";

export const router = Router();

router.post("/signup", signup);
