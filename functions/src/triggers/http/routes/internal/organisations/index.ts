import { z } from "zod";
import { wrapEndpoint } from "../../../utils/wrapEndpoint";
import { createBatchDatum, writeBatch } from "../../../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../../../clients/firebase/firestore/collection";
import { ok, unauthorized } from "../../../utils/httpResponses";
import { randomUUID } from "crypto";
import { OrganisationRole } from "@sycamore-fyi/shared";
import { authenticateUser } from "../../../middleware/authenticateUser";

const createOrganisationSchema = {
  body: z.object({
    name: z.string(),
  }),
};

export const post = [
  authenticateUser,
  wrapEndpoint(createOrganisationSchema)(async (req, res) => {
    const { name } = req.body;
    if (!req.user) return unauthorized(res);
    const { id: userId } = req.user;
    const organisationId = randomUUID();

    await writeBatch([
      createBatchDatum(Collection.Organisation.doc(organisationId), {
        name,
        createdAt: new Date(),
      }),
      createBatchDatum(Collection.Membership.doc(), {
        organisationId,
        userId,
        role: OrganisationRole.ADMIN,
        createdAt: new Date(),
      }),
    ]);

    return ok(res, { organisationId });
  }),
];
