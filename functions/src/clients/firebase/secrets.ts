import { SecretParam } from "firebase-functions/lib/params/types";
import { defineSecret } from "firebase-functions/params";
import { decode } from "../../utils/base64";

export const openaiCredentials = defineSecret("OPENAI_CREDENTIALS");
export const beamCredentials = defineSecret("BEAM_CREDENTIALS");
export const getCredentials = <T>(secret: SecretParam): T => JSON.parse(decode(secret.value()));
