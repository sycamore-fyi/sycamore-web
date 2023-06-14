import { getCredentials, sendgridCredentials } from "../firebase/secrets";
import * as sg from "@sendgrid/mail";

interface SendgridCredentials {
  apiKey: string
}

export function sendgrid(
  { apiKey }: SendgridCredentials = getCredentials<SendgridCredentials>(sendgridCredentials)
) {
  sg.setApiKey(apiKey);
  return sg;
}
