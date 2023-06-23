import { createLazyRouter } from "express-lazy-router";
import * as express from "express";
import { logRequest } from "../middleware/logRequest";
import { errorHandler } from "../middleware/errorHandler";

const lazyLoad = createLazyRouter();

const handleSlack = express();
handleSlack.use(express.json());
handleSlack.use(express.urlencoded({ extended: true }));
handleSlack.use(express.query({}));
handleSlack.use(logRequest);
handleSlack.get("/status", (req, res) => res.status(200).json({ message: "got request" }));
handleSlack.use("/", lazyLoad(() => import("./slackReceiver")));
handleSlack.use(errorHandler);

export { handleSlack };
