import { AxiosError } from "axios";
import { logger } from "firebase-functions/v2";
import { ZodError } from "zod";

export function handleError(err: any) {
  if (err instanceof AxiosError) {
    const { code, status, message } = err;

    logger.error({
      code,
      status,
      message,
      data: err.response?.data,
    });
  } else if (err instanceof ZodError) {
    const { message, errors, formErrors, issues } = err;

    logger.error({
      message,
      errors,
      formErrors,
      issues,
    });
  } else {
    logger.error(err);
  }
}
