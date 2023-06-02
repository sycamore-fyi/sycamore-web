import { getEnvironment } from "../../../clients/firebase/Environment";
import { ok } from "../utils/httpResponses";
import { wrapEndpoint } from "../utils/wrapEndpoint";

export const get = wrapEndpoint({})((req, res) => {
  return ok(res, {
    environment: getEnvironment(),
  });
});
