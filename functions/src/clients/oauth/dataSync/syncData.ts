import { OauthIntegration, SuccessStatus, SyncedDataType } from "@sycamore-fyi/shared";
import { Collection } from "../../firebase/firestore/collection";
import { createBatchDatum, writeBatch } from "../../firebase/firestore/writeBatch";
import { randomUUID } from "crypto";
import { fetchLatest } from "../../firebase/firestore/fetchLatest";
import { syncDataRecursive } from "./syncDataRecursive";

export interface SyncRequest {
  accessToken: string,
  organisationId: string,
  oauthConnectionId: string
}

export function syncData({ organisationId, oauthConnectionId }: SyncRequest) {
  return async <T>(
    fetchFn: (cursor?: string) => Promise<{ data: T[]; cursor?: string; }>,
    oauthIntegration: OauthIntegration,
    syncedDataType: SyncedDataType
  ) => {
    const latestDataExtraction = await fetchLatest(Collection.DataExtraction
      .where("organisationId", "==", organisationId)
      .where("oauthConnectionId", "==", oauthConnectionId));
    const cursor = latestDataExtraction?.data()?.cursor;
    const dataExtractionId = randomUUID();
    const dataExtractionRef = Collection.DataExtraction.doc(dataExtractionId);
    const updateExtractionStatus = (isSuccess: boolean) => dataExtractionRef.update({ status: isSuccess ? SuccessStatus.SUCCEEDED : SuccessStatus.FAILED });

    try {
      await Promise.all([
        dataExtractionRef.create({
          organisationId,
          status: SuccessStatus.PENDING,
          oauthConnectionId,
          createdAt: new Date(),
        }),
        syncDataRecursive({
          fetchFn,
          async saveFn(data) {
            await writeBatch(data.map((datum) => createBatchDatum(
              Collection.SyncedData.doc(randomUUID()),
              {
                organisationId,
                createdAt: new Date(),
                integration: oauthIntegration,
                type: syncedDataType,
                data: datum,
                dataExtractionId,
                oauthConnectionId,
              }
            )));
          },
          cursor,
        }),
      ]);
      await updateExtractionStatus(true);
    } catch (err) {
      await updateExtractionStatus(false);
    }
  };
}
