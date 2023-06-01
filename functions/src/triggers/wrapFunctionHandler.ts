import { UserRecord } from "firebase-functions/v1/auth";
import { CloudEvent, logger } from "firebase-functions/v2";

export const wrapFunctionHandler = <EventData, Event extends CloudEvent<EventData>>(handler: (event: Event) => Promise<void>) => async (event: Event) => {
  try {
    await handler(event);
  } catch (err) {
    logger.error(err);
  }
};

export const wrapV1AuthFunctionHandler = (handler: (user: UserRecord) => Promise<void>) => async (user: UserRecord) => {
  try {
    await handler(user);
  } catch (err) {
    logger.error(err);
  }
};
