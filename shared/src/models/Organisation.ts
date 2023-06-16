import { OrganisationPlanId } from "../enums/OrganisationPlanId";

export interface Organisation {
  name: string,
  createdAt: Date,
  planId: OrganisationPlanId,
}
