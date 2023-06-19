import { OauthConnection } from "@sycamore-fyi/shared";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { syncFunctions } from "../../../clients/oauth/dataSync/syncFunctions";
import { getAccessToken } from "../../../clients/oauth/dataSync/getAccessToken";
import { deleteAll } from "../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../clients/firebase/firestore/collection";

export const handleOauthConnectionChange = wrapChangeHandler<OauthConnection>({
  async onCreate(afterData, id) {
    const accessToken = await getAccessToken(afterData, id);
    const { integration, organisationId } = afterData;
    await syncFunctions[integration]({ accessToken, organisationId, oauthConnectionId: id });
  },
  async onDelete(beforeData, id) {
    await deleteAll([
      Collection.SyncedData.where("oauthConnectionId", "==", id),
      Collection.DataExtraction.where("oauthConnectionId", "==", id),
    ]);
  },
});
