import type { Response } from "express";

export function sendRespons<T>(
  res: Response,
  { message, data, error }: { message: unknown; data?: T; error?: boolean },
  status = 200,
): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      success: error ? false : true,
      message: message,
      data: error ? [] : data,
    }),
  );
}
