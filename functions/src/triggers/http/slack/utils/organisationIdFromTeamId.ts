import { OauthIntegration } from "@sycamore-fyi/shared";
import { Collection } from "../../../../clients/firebase/firestore/collection";

export async function connectionFromTeam(team: string) {
  const { docs: connections } = await Collection.OauthConnection
    .where("integration", "==", OauthIntegration.SLACK)
    .where("metadata.slack.team", "==", team)
    .get();

  if (connections.length === 0) return;

  const connectionData = connections[0].data();

  if (!connectionData) return;

  return { id: connections[0].id, data: connectionData };
}
