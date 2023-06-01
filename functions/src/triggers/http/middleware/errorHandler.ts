import { NextFunction, Request, Response } from "express";
import { logger } from "firebase-functions/v1";
import { ZodError } from "zod";
import { clientError, internalServerError } from "../utils/httpResponses";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const { issues } = err;
    return clientError(res, "Validation Errors", {
      validationErrors: issues,
    });
  }
  logger.error("new http error", err);
  return internalServerError(res);
};
