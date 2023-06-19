import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { exchangeAuthCodeForTokens } from "../../../../../../clients/oauth/auth/exchangeAuthCodeForTokens";
import { Collection } from "../../../../../../clients/firebase/firestore/collection";
import { OauthIntegration } from "@sycamore-fyi/shared";

export const post = wrapEndpoint({
  params: z.object({
    integration: z.enum([OauthIntegration.HUBSPOT]),
  }),
  body: z.object({
    code: z.string().nonempty(),
    state: z.string().nonempty(),
  }),
}, false)(async (req, res) => {
  const {
    body: { code, state: stateId },
    params: { integration },
  } = req;

  const [{ refreshToken }, state] = await Promise.all([
    exchangeAuthCodeForTokens(integration, code),
    Collection.OauthState.doc(stateId).get(),
  ]);

  const stateData = state.data();

  if (!stateData) throw new Error("no state data");

  const { organisationId } = stateData;

  await Collection.OauthConnection.add({
    integration,
    createdAt: new Date(),
    organisationId,
    refreshToken,
  });

  return res.status(200).json({ organisationId });
});
