import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller";

export const router = Router();

router.post("/signup", signup);
router.post("/login", signin);
