import type { Response } from "express";
import type { CustomRequest } from "../middleware/auth.middleware";
import issueService from "../service/issue.service";
import { sendRespons } from "../../utils/sendRespons";

export const createIssue = async (req: CustomRequest, res: Response) => {
  const { title, description, type } = req.body;
  const reporter_id = req.user?.id;

  if (!title || !description || !type) {
    sendRespons(
      res,
      { message: "Title, description, and type are required" },
      400,
    );
    return;
  }

  if (description.length < 20) {
    sendRespons(
      res,
      { message: "Description must be at least 20 characters long" },
      400,
    );
    return;
  }

  if (title.length > 150) {
    sendRespons(res, { message: "Title must not exceed 150 characters" }, 400);
    return;
  }

  if (!reporter_id) {
    sendRespons(res, { message: "User context not found" }, 401);
    return;
  }

  const newIssue = await issueService.createIssue({
    title,
    description,
    type,
    reporter_id,
  });

  sendRespons(
    res,
    { message: "Issue created successfully", data: newIssue },
    201,
  );
};
