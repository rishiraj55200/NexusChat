import { NextFunction, Request, RequestHandler, Response } from "express";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null) {
    const value = error as {
      message?: unknown;
      error?: { message?: unknown };
    };

    if (typeof value.message === "string") return value.message;
    if (typeof value.error?.message === "string") return value.error.message;

    try {
      return JSON.stringify(error);
    } catch {
      return "An unexpected error occurred";
    }
  }

  return String(error);
};

const TryCatch = (handler: RequestHandler): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error: unknown) {
      console.error("Request handler failed:", error);
      res.status(500).json({
        message: getErrorMessage(error),
      });
    }
  };
};

export default TryCatch;
