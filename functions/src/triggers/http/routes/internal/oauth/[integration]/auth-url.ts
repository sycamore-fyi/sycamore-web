import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { constructAuthUrl } from "../../../../../../clients/oauth/auth/constructAuthUrl";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { Collection } from "../../../../../../clients/firebase/firestore/collection";

export const post = wrapEndpoint({
  params: z.object({
    integration: z.nativeEnum(OauthIntegration),
  }),
  body: z.object({
    organisationId: z.string().nonempty(),
    stateId: z.string().nonempty(),
  }),
})(async (req, res) => {
  const { organisationId, stateId } = req.body;
  const { integration } = req.params;
  await Collection.OauthState.doc(stateId).create({ organisationId });
  const authUrl = constructAuthUrl(integration, stateId);
  return res.status(200).json({ authUrl });
});
