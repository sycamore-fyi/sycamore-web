import { track } from "@amplitude/analytics-browser";
import { Event } from "./Event";
import { Page } from "./Page";
import { Button } from "./Button";

export function logEvent(event: Event, eventProperties: Record<string, any> = {}) {
  track(event, eventProperties)
}

export function logPageView(page: Page, eventProperties: Record<string, any> = {}) {
  logEvent(Event.VIEW_PAGE, {
    page,
    ...eventProperties
  })
}

export function logButtonPress(button: Button, eventProperties: Record<string, any> = {}) {
  logEvent(Event.PRESS_BUTTON, {
    button,
    ...eventProperties
  })
}