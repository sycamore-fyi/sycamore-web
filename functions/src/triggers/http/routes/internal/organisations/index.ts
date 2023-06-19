import { z } from "zod";
import { wrapEndpoint } from "../../../utils/wrapEndpoint";
import { createBatchDatum, writeBatch } from "../../../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../../../clients/firebase/firestore/collection";
import { ok } from "../../../utils/httpResponses";
import { randomUUID } from "crypto";
import { OrganisationRole } from "@sycamore-fyi/shared";
import { OrganisationPlanId } from "@sycamore-fyi/shared/build/enums/OrganisationPlanId";
import { fetchById } from "../../../../../clients/firebase/firestore/fetchById";

export const post = wrapEndpoint({
  body: z.object({
    name: z.string(),
  }),
})(async (req, res) => {
  const { name } = req.body;
  const { id: userId } = req.user;
  const organisationId = randomUUID();
  const membershipId = `${organisationId}:${userId}`;

  const user = await fetchById(Collection.User, userId);
  const { name: userName, photoUrl } = user;

  await writeBatch([
    createBatchDatum(Collection.Organisation.doc(organisationId), {
      name,
      createdAt: new Date(),
      planId: OrganisationPlanId.FREE,
    }),
    createBatchDatum(Collection.Membership.doc(membershipId), {
      organisationId,
      organisationName: name,
      userId,
      userName,
      userPhotoUrl: photoUrl,
      role: OrganisationRole.ADMIN,
      createdAt: new Date(),
    }),
  ]);

  return ok(res, {
    organisationId,
    membershipId,
  });
});
