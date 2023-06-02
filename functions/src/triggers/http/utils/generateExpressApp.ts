import * as express from "express";
import { logRequest } from "../middleware/logRequest";
import { errorHandler } from "../middleware/errorHandler";
import { router } from "express-file-routing";
import { Request } from "firebase-functions/v2/https";
import { Response } from "firebase-functions";
import * as path from "path";
import { parseQueryNumbers } from "../middleware/parseQueryNumbers";

export const generateExpressApp = (dirname: string) => async (req: Request, res: Response) => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.query({}));
  app.use(parseQueryNumbers);
  app.use(logRequest);
  app.use("/", await router({
    directory: path.join(dirname, "routes"),
    routerOptions: {
      mergeParams: true,
    },
  }));
  app.use(errorHandler);
  app(req, res);
};
