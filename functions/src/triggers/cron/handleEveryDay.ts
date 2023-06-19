import { Collection } from "../../clients/firebase/firestore/collection";
import { getAccessToken } from "../../clients/oauth/dataSync/getAccessToken";
import { syncFunctions } from "../../clients/oauth/dataSync/syncFunctions";
import { wrapFunctionHandler } from "../wrapFunctionHandler";

export const handleEveryDay = wrapFunctionHandler(async () => {
  const { docs: oauthConnections } = await Collection.OauthConnection.get();

  await Promise.all(oauthConnections.map(async (connection) => {
    const connectionData = connection.data();

    if (!connectionData) return;
    const accessToken = await getAccessToken(connectionData, connection.id);
    const { integration, organisationId } = connectionData;
    return syncFunctions[integration]({ oauthConnectionId: connection.id, accessToken, organisationId });
  }));
});
