import { SecretParam } from "firebase-functions/lib/params/types";
import { defineSecret } from "firebase-functions/params";
import { decode } from "../../utils/base64";

export const openaiCredentials = defineSecret("OPENAI_CREDENTIALS");
export const beamCredentials = defineSecret("BEAM_CREDENTIALS");
export const sendgridCredentials = defineSecret("SENDGRID_CREDENTIALS");
export const stripeCredentials = defineSecret("STRIPE_CREDENTIALS");
export const hubspotCredentials = defineSecret("HUBSPOT_CREDENTIALS");
export const pineconeCredentials = defineSecret("PINECONE_CREDENTIALS");
export const zoomCredentials = defineSecret("ZOOM_CREDENTIALS");
export const slackCredentials = defineSecret("SLACK_CREDENTIALS");
export const googleWorkspaceCredentials = defineSecret("GOOGLE_WORKSPACE_CREDENTIALS");
export const getCredentials = <T>(secret: SecretParam): T => JSON.parse(decode(secret.value()));
