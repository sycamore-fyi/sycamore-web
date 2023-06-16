import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { exchangeAuthCodeForTokens } from "../../../../../../clients/oauth/fetchTokens";
import { Collection } from "../../../../../../clients/firebase/firestore/collection";
import { OauthIntegration } from "@sycamore-fyi/shared";

export const post = wrapEndpoint({
  params: z.object({
    integration: z.enum([OauthIntegration.HUBSPOT]),
  }),
  body: z.object({
    code: z.string().nonempty(),
    organisationId: z.string().nonempty(),
  }),
})(async (req, res) => {
  const {
    body: { code, organisationId },
    params: { integration },
  } = req;

  const { refreshToken } = await exchangeAuthCodeForTokens(integration, code);

  await Collection.OauthConnection.add({
    integration,
    createdAt: new Date(),
    organisationId,
    refreshToken,
  });

  return res.sendStatus(200);
});
