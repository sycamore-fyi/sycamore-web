import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { constructAuthUrl } from "../../../../../../clients/oauth/fetchTokens";
import { OauthIntegration } from "@sycamore-fyi/shared";

export const get = wrapEndpoint({
  params: z.object({
    integration: z.enum([OauthIntegration.HUBSPOT]),
  }),
})((req, res) => {
  return res.status(200).json({
    authUrl: constructAuthUrl(req.params.integration),
  });
});
