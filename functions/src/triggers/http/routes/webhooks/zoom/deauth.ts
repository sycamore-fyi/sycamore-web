import { z } from "zod";
import { wrapEndpoint } from "../../../utils/wrapEndpoint";
import { Collection } from "../../../../../clients/firebase/firestore/collection";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { deleteAll, deleteBatchDatum, writeBatch } from "../../../../../clients/firebase/firestore/writeBatch";
import { getCredentials, zoomCredentials } from "../../../../../clients/firebase/secrets";
import { Request } from "express";
import * as crypto from "crypto";

function verifyZoomWebhook(request: Request) {
  const { secretToken } = getCredentials<{ secretToken: string, clientId: string }>(zoomCredentials);
  const message = `v0:${request.headers["x-zm-request-timestamp"]}:${JSON.stringify(request.body)}`;
  const hashForVerify = crypto.createHmac("sha256", secretToken).update(message).digest("hex");
  const signature = `v0=${hashForVerify}`;
  return request.headers["x-zm-signature"] === signature;
}

export const post = wrapEndpoint({
  body: z.object({
    event: z.literal("app_deauthorized"),
    payload: z.object({
      account_id: z.string(),
      user_id: z.string(),
      signature: z.string(),
      deauthorization_time: z.string(),
      client_id: z.string(),
    }),
  }),
})(async (req, res) => {
  if (!verifyZoomWebhook(req)) {
    return res.sendStatus(401);
  }

  const { clientId } = getCredentials<{ secretToken: string, clientId: string }>(zoomCredentials);

  const { payload } = req.body;

  if (payload.client_id !== clientId) return res.sendStatus(200);


  // await deleteAll([
  //   Collection.OauthConnection
  //     .where("integration", "==", OauthIntegration.ZOOM)
  //     .where("organisationId", "==", organisationId),
  // ]);

  return res.sendStatus(200);
});
