import type { CustomRequest } from "../middleware/auth.middleware";
import issueService from "../service/issue.service";
import { sendRespons } from "../../utils/sendRespons";
import type { Request, Response, NextFunction } from "express";
import { sql } from "../../db";

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

export const getAllIssues = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sort, type, status } = req.query;
    const issues = await issueService.getAllIssues({
      sort: sort as string,
      type: type as string,
      status: status as string,
    });

    if (issues.length === 0) {
      sendRespons(
        res,
        { message: "Issues retrieved successfully", data: [] },
        200,
      );
      return;
    }

    const reporterIds = [
      ...new Set(issues.map((issue: any) => issue.reporter_id)),
    ];
    const userMap: any = {};
    for (const id of reporterIds) {
      const userRes =
        await sql`SELECT id, name, role FROM users WHERE id = ${id}`;
      if (userRes[0]) userMap[id] = userRes[0];
    }

    const result = issues.map((issue: any) => {
      const { reporter_id, ...issueData } = issue;
      return { ...issueData, reporter: userMap[reporter_id] || null };
    });

    sendRespons(
      res,
      { message: "Issues retrieved successfully", data: result },
      200,
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleIssue = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issueId = Number(req.params.id);

    if (isNaN(issueId)) {
      sendRespons(
        res,
        { message: "Invalid issue ID format", error: "ID must be a number" },
        400,
      );
      return;
    }
    const issue = await issueService.getIssueById(issueId);
    if (!issue) {
      sendRespons(
        res,
        {
          message: "Issue not found",
          error: `No issue found with ID ${issueId}`,
        },
        404,
      );
      return;
    }

    const userRes = await sql`
      SELECT id, name, role FROM users WHERE id = ${issue.reporter_id}
    `;
    const reporter = userRes[0] || null;
    const { reporter_id, ...issueData } = issue as any;
    const result = {
      ...issueData,
      reporter,
    };

    sendRespons(
      res,
      { message: "Issue retrieved successfully", data: result },
      200,
    );
  } catch (error) {
    next(error);
  }
};

// ────────────────────────────────────────────
// PATCH /api/issues/:id
// ────────────────────────────────────────────

export const updateIssue = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issueId = Number(req.params.id);
    const { title, description, type } = req.body;
    const currentUser = req.user;

    // ID validate করো
    if (isNaN(issueId)) {
      sendRespons(res, { message: "Invalid issue ID, must be a number" }, 400);
      return;
    }

    const issue = await issueService.getIssueById(issueId);
    if (!issue) {
      sendRespons(res, { message: `No issue found with ID ${issueId}` }, 404);
      return;
    }

    const isMaintainer = currentUser?.role === "maintainer";
    const isOwnIssue = issue.reporter_id === currentUser?.id;
    const isOpen = issue.status === "open";

    if (!isMaintainer && !isOwnIssue) {
      sendRespons(res, { message: "You can only update your own issues" }, 403);
      return;
    }

    if (!isMaintainer && isOwnIssue && !isOpen) {
      sendRespons(
        res,
        { message: "You can only update your issue when status is open" },
        409,
      );
      return;
    }

    // Validation
    if (title && title.length > 150) {
      sendRespons(
        res,
        { message: "Title must not exceed 150 characters" },
        400,
      );
      return;
    }

    if (description && description.length < 20) {
      sendRespons(
        res,
        { message: "Description must be at least 20 characters" },
        400,
      );
      return;
    }

    const updatedIssue = await issueService.updateIssue(issueId, {
      title,
      description,
      type,
    });

    sendRespons(
      res,
      { message: "Issue updated successfully", data: updatedIssue },
      200,
    );
  } catch (error) {
    next(error);
  }
};
// delete
export const deleteIssue = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const issueId = Number(req.params.id);

    if (isNaN(issueId)) {
      sendRespons(res, { message: "Invalid issue ID, must be a number" }, 400);
      return;
    }

    const issue = await issueService.getIssueById(issueId);
    if (!issue) {
      sendRespons(res, { message: `No issue found with ID ${issueId}` }, 404);
      return;
    }

    await issueService.deleteIssue(issueId);

    sendRespons(res, { message: "Issue deleted successfully" }, 200);
  } catch (error) {
    next(error);
  }
};
