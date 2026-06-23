import { Router } from "express";
import { authMiddleware, authorizeRole } from "../middleware/auth.middleware";
import {
  createIssue,
  getAllIssues,
  getSingleIssue,
  deleteIssue,
  updateIssue,
} from "../controllers/issue.controller";

export const issueRouter = Router();

issueRouter.post("/issues", authMiddleware, createIssue);
issueRouter.get("/issues", getAllIssues);
issueRouter.get("/issues/:id", getSingleIssue);
issueRouter.patch("/issues/:id", authMiddleware, updateIssue);
issueRouter.delete(
  "/issues/:id",
  authMiddleware,
  authorizeRole("maintainer"),
  deleteIssue,
);
