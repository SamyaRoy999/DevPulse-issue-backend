import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createIssue } from "../controllers/issue.controller";

export const issueRouter = Router();

issueRouter.post("/issues", authMiddleware, createIssue);
