import { z } from "zod";
import { wrapEndpoint } from "../../../../utils/wrapEndpoint";
import { Collection } from "../../../../../../clients/firebase/firestore/collection";
import { clientError, forbidden } from "../../../../utils/httpResponses";
import { fetchById } from "../../../../../../clients/firebase/firestore/fetchById";

export const del = wrapEndpoint({
  params: z.object({
    inviteId: z.string(),
  }),
})(async (req, res) => {
  const { id: userId } = req.user;
  const { inviteId } = req.params;

  const invite = await fetchById(Collection.Invite, inviteId);
  if (invite.invitingUserId !== userId) return forbidden(res, "That's not your invite");
  if (invite.isCancelled) return clientError(res, "Invite is already cancelled");
  if (invite.isAccepted) return clientError(res, "Invite was already accepted");

  await Collection.Invite.doc(inviteId).update({
    isCancelled: true,
    cancelledAt: new Date(),
  });

  return res.sendStatus(200);
});
