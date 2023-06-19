import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { OrganisationRole } from "@sycamore-fyi/shared";
import { clientError, ok } from "../../../../utils/httpResponses";
import { createBatchDatum, writeBatch } from "../../../../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../../../../clients/firebase/firestore/collection";
import { sendEmail } from "../../../../../../clients/sendgrid/sendEmail";
import { TemplateName } from "../../../../../../clients/sendgrid/TemplateName";
import { randomUUID } from "crypto";
import { config } from "../../../../../../config";
import { fetchById } from "../../../../../../clients/firebase/firestore/fetchById";
import { OrganisationPlanId } from "@sycamore-fyi/shared/build/enums/OrganisationPlanId";
import { logger } from "firebase-functions/v2";
import * as pluralize from "pluralize";

const freePlanMemberLimit = 3;

async function isWithinMemberQuota(
  organisationId: string,
  organisationPlanId: OrganisationPlanId,
  inviteCount: number,
) {
  if (organisationPlanId !== OrganisationPlanId.FREE) return { valid: true };

  const [
    { docs: pendingInvites },
    { docs: memberships },
  ] = await Promise.all([
    Collection.Invite
      .where("organisationId", "==", organisationId)
      .where("isCancelled", "==", false)
      .where("isAccepted", "==", false)
      .get(),
    Collection.Membership.where("organisationId", "==", organisationId).get(),
  ]);

  const valid = pendingInvites.length + memberships.length + inviteCount <= freePlanMemberLimit;

  let message;

  pluralize;

  const baseMessage = `You're attempting to invite ${inviteCount} ${pluralize("person", inviteCount)}. Your organisation is on the free plan, so it's limited to ${freePlanMemberLimit} members. It currently has ${memberships.length} members`;

  if (pendingInvites.length > 0) {
    message = `${baseMessage} and ${pendingInvites.length} pending invites. To invite someone else, either upgrade your org's plan, cancel one of your pending invites or remove an existing member.`;
  } else {
    message = `${baseMessage}. To invite someone else, either upgrade your org's plan or remove an existing member.`;
  }

  return {
    valid,
    message,
  };
}

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
  const { id: userId } = req.user;

  const inviteIds = inviteItems.map(() => randomUUID());
  const [organisation, user] = await Promise.all([
    fetchById(Collection.Organisation, organisationId),
    fetchById(Collection.User, userId),
  ]);

  const { planId } = organisation;

  const { valid, message } = await isWithinMemberQuota(organisationId, planId, inviteItems.length);

  if (!valid) {
    logger.info("organisation falls foul of plan membership limit, returning", {
      planId,
      organisationId,
      message,
    });
    return clientError(res, message);
  }

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
            inviterName: user.name ?? "a Sycamore user",
            inviteLink: `${config().CLIENT_URL}/invites/${inviteIds[index]}/accept`,
          },
        };
      })
    ),
  ]);

  return ok(res);
});
