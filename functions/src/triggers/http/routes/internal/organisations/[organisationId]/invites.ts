import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { OrganisationRole } from "@sycamore-fyi/shared";
import { ok } from "../../../../utils/httpResponses";
import { createBatchDatum, writeBatch } from "../../../../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../../../../clients/firebase/firestore/collection";
import { sendEmail } from "../../../../../../clients/sendgrid/sendEmail";
import { TemplateName } from "../../../../../../clients/sendgrid/TemplateName";
import { randomUUID } from "crypto";
import { config } from "../../../../../../config";
import { fetchById } from "../../../../../../clients/firebase/firestore/fetchById";

export const post = wrapEndpoint({
  params: z.object({
    organisationId: z.string(),
  }),
  body: z.object({
    inviteItems: z.array(
      z.object({
        role: z.enum([OrganisationRole.ADMIN, OrganisationRole.MEMBER]),
        email: z.string().email(),
      })
    ),
  }),
})(async (req, res) => {
  const { inviteItems } = req.body;
  const { organisationId } = req.params;
  const { id: userId, displayName } = req.user;

  const inviteIds = inviteItems.map(() => randomUUID());
  const organisation = await fetchById(Collection.Organisation, organisationId);

  await Promise.all([
    writeBatch(
      inviteItems.map(({ email, role }, index) => createBatchDatum(
        Collection.Invite.doc(inviteIds[index]),
        {
          email,
          role,
          createdAt: new Date(),
          invitingUserId: userId,
          organisationId,
          isAccepted: false,
          isCancelled: false,
        }
      ))
    ),
    sendEmail(TemplateName.INVITE)(
      inviteItems.map(({ email }, index) => {
        return {
          toEmail: email,
          data: {
            organisationName: organisation.name,
            inviterName: displayName ?? "a Sycamore user",
            inviteLink: `${config().CLIENT_URL}/invites/${inviteIds[index]}/accept`,
          },
        };
      })
    ),
  ]);

  return ok(res);
});
