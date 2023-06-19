import { NextFunction, Request, Response } from "express";
import { logger } from "firebase-functions/v1";
import { ZodError } from "zod";
import { clientError, internalServerError } from "../utils/httpResponses";
import { AxiosError } from "axios";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const { issues } = err;
    return clientError(res, "Validation Errors", {
      validationErrors: issues,
    });
  } else if (err instanceof AxiosError) {
    const { code, status, message } = err;

    logger.error({
      code,
      status,
      message,
      data: err.response?.data,
    });
  } else {
    logger.error("new http error", err);
  }

  return internalServerError(res);
};
