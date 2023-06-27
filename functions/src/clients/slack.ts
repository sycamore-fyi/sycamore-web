import { Collection } from "./firebase/firestore/collection";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { WebClient } from "@slack/web-api";

export const slack = async (organisationId: string) => {
  const { docs: connections } = await Collection.OauthConnection
    .where("organisationId", "==", organisationId)
    .where("integration", "==", OauthIntegration.SLACK)
    .get();

  if (!connections.length) throw new Error("No Slack connections found for the given organisationId");

  const connectionData = connections[0].data();
  if (!connectionData) throw new Error("No connection data retrieved for the first Slack connection");

  const { accessToken } = connectionData;
  if (!accessToken) throw new Error("No access token found in the connection data");

  return new WebClient(accessToken);
};
