import { z } from "zod";
import { wrapEndpoint } from "../../../utils/wrapEndpoint";
import { createBatchDatum, writeBatch } from "../../../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../../../clients/firebase/firestore/collection";
import { ok } from "../../../utils/httpResponses";
import { randomUUID } from "crypto";
import { OrganisationRole } from "@sycamore-fyi/shared";

export const post = wrapEndpoint({
  body: z.object({
    name: z.string(),
  }),
})(async (req, res) => {
  const { name } = req.body;
  const { id: userId, displayName, picture } = req.user;
  const organisationId = randomUUID();
  const membershipId = `${organisationId}:${userId}`;

  await writeBatch([
    createBatchDatum(Collection.Organisation.doc(organisationId), {
      name,
      createdAt: new Date(),
    }),
    createBatchDatum(Collection.Membership.doc(membershipId), {
      organisationId,
      organisationName: name,
      userId,
      userName: displayName,
      userPhotoUrl: picture,
      role: OrganisationRole.ADMIN,
      createdAt: new Date(),
    }),
  ]);

  return ok(res, {
    organisationId,
    membershipId,
  });
});
