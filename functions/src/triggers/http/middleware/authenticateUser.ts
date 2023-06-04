import { NextFunction, Response } from "express";
import { logger } from "firebase-functions/v1";
import { unauthorized } from "../utils/httpResponses";
import { auth } from "../../../clients/firebase/admin";

export const authenticateUser = async (req: any, res: Response, next: NextFunction) => {
  try {
    logger.info("authenticating user");

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.error("malformed firebase auth header");
      return unauthorized(res);
    }

    const idToken = authHeader.split("Bearer ")[1];

    logger.info("got id token");

    const decodedIdToken = await auth.verifyIdToken(idToken);
    const { uid: id, email } = decodedIdToken;

    logger.info("decoded id token", { userId: id });

    req.user = { id, email };

    return next();
  } catch (err) {
    return unauthorized(res);
  }
};
