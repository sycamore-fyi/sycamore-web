import { ok } from "../utils/httpResponses";
import { wrapEndpoint } from "../utils/wrapEndpoint";

export const get = wrapEndpoint({})((req, res) => ok(res));
