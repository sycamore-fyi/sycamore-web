import { UserRecord } from "firebase-functions/v1/auth";
import { CloudEvent } from "firebase-functions/v2";
import { ScheduledEvent } from "firebase-functions/v2/scheduler";
import { handleError } from "./handleError";

export const wrapFunctionHandler = <EventData, Event extends CloudEvent<EventData> | ScheduledEvent>(handler: (event: Event) => Promise<void>) => async (event: Event) => {
  try {
    await handler(event);
  } catch (err) {
    handleError(err);
  }
};

export const wrapV1AuthFunctionHandler = (handler: (user: UserRecord) => Promise<void>) => async (user: UserRecord) => {
  try {
    await handler(user);
  } catch (err) {
    handleError(err);
  }
};
