import { Response } from "express";

export enum StatusCode {
  OK = 200,
  CREATED = 201,
  CLIENT_ERROR = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

function response(res: Response, statusCode: StatusCode, message = "", json: any = {}): Response {
  return res.status(statusCode).json({ message, ...json });
}

export function ok(res: Response, json: any = {}): Response {
  return res.status(StatusCode.OK).json(json);
}

export function created(res: Response, message = "", json: any = {}): Response {
  return response(res, StatusCode.CREATED, message, json);
}

export function clientError(res: Response, message = "", json: any = {}): Response {
  return response(res, StatusCode.CLIENT_ERROR, message, json);
}

export function unauthorized(res: Response, message = "", json: any = {}): Response {
  return response(res, StatusCode.UNAUTHORIZED, message, json);
}

export function forbidden(res: Response, message = "", json: any = {}): Response {
  return response(res, StatusCode.FORBIDDEN, message, json);
}

export function notFound(res: Response, message = "", json: any = {}): Response {
  return response(res, StatusCode.NOT_FOUND, message, json);
}

export function internalServerError(res: Response, message = "", json: any = {}): Response {
  return response(res, StatusCode.INTERNAL_SERVER_ERROR, message, json);
}
