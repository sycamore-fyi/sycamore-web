import { getCredentials, stripeCredentials } from "../firebase/secrets";
import { Stripe } from "stripe";

export interface StripeCredentials {
  apiKey: string
}

export function stripe(
  { apiKey }: StripeCredentials = getCredentials<StripeCredentials>(stripeCredentials)
) {
  return new Stripe(apiKey, {
    apiVersion: "2022-11-15",
  });
}
