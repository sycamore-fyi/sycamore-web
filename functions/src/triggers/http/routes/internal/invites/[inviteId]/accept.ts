import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { clientError, ok } from "../../../../utils/httpResponses";
import { Collection } from "../../../../../../clients/firebase/firestore/collection";
import { addDays } from "date-fns";
import { createBatchDatum, updateBatchDatum, writeBatch } from "../../../../../../clients/firebase/firestore/writeBatch";
import { fetchById } from "../../../../../../clients/firebase/firestore/fetchById";

export const put = wrapEndpoint({
  params: z.object({
    inviteId: z.string(),
  }),
})(async (req, res) => {
  const { inviteId } = req.params;

  const invite = await fetchById(Collection.Invite, inviteId);

  const {
    organisationId,
    role,
    isAccepted,
    isCancelled,
    createdAt,
    email: inviteEmail,
  } = invite;

  const isExpired = addDays(createdAt, 1) < new Date();

  if (isAccepted) return clientError(res, "Invite has already been accepted");
  if (isCancelled || isExpired) return clientError(res, "Invite has expired");

  const { id: userId, email: userEmail } = req.user;

  if (userEmail !== inviteEmail) return clientError(res, "Invite is not for you");

  const [organisation, user] = await Promise.all([
    fetchById(Collection.Organisation, organisationId),
    fetchById(Collection.User, userId),
  ]);

  const { name: organisationName } = organisation;
  const { name: userName, photoUrl: userPhotoUrl } = user;

  const membershipId = `${organisationId}:${userId}`;

  await writeBatch([
    createBatchDatum(Collection.Membership.doc(membershipId), {
      organisationId,
      organisationName,
      userId,
      role,
      userName,
      userPhotoUrl,
      createdAt: new Date(),
    }),
    updateBatchDatum(Collection.Invite.doc(inviteId), {
      isAccepted: true,
      acceptingUserId: userId,
      acceptedAt: new Date(),
    }),
  ]);

  return ok(res, { organisationId });
});
