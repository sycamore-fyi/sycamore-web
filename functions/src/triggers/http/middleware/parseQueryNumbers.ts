import { NextFunction, Request, Response } from "express";
import { deepModify } from "../../../utils/deepModify";
import { isNumber } from "../../../utils/isNumber";

export const parseQueryNumbers = (req: Request, res: Response, next: NextFunction) => {
  req.query = deepModify(req.query, {
    string: (value: string) => isNumber(value) ? Number(value) : value,
  });

  next();
};
