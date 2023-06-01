import { NextFunction } from "express";
import { logger } from "firebase-functions/v1";

export const logRequest = (req: any, res: any, next: NextFunction) => {
  logger.info("new http request", {
    url: req.originalUrl,
  });

  return next();
};
