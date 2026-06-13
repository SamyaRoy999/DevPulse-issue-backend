import type { Response } from "express";

interface ResponseOptions<T> {
  message: string;
  data?: T | undefined;
  error?: unknown | undefined;
}

export function sendRespons<T>(
  res: Response,
  { message, data, error }: ResponseOptions<T>,
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
