import type { Request, Response } from "express";
import { sendRespons } from "./sendRespons";

export const globalErrorHandler = (err: unknown, res: Response): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorDetails: unknown = "An unexpected error occurred";

  if (err instanceof Error) {
    message = err.message;
    errorDetails = err.stack || err.toString();
    if ("code" in err && err.code === "23505") {
      statusCode = 400;
      message = "Duplicate entry error";
      errorDetails = "The provided email or unique field already exists.";
    }
  } else if (typeof err === "string") {
    message = err;
    errorDetails = err;
  }

  sendRespons(
    res,
    {
      message: message,
      error: errorDetails,
    },
    statusCode,
  );
};
