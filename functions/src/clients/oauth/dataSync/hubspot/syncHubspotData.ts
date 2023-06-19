import { OauthIntegration, SyncedDataType } from "@sycamore-fyi/shared";
import * as hubspot from "@hubspot/api-client";
import { SyncRequest, syncData } from "../syncData";

export function syncHubspotData({ accessToken, organisationId, oauthConnectionId }: SyncRequest) {
  return async <T>(
    syncedDataType: SyncedDataType,
    endpoint: (client: hubspot.Client) => (limit: number, cursor?: string) => Promise<{
      results: { properties: T; }[];
      paging?: { next?: { after?: string; }; };
    }>
  ) => {
    const client = new hubspot.Client({
      accessToken,
      numberOfApiCallRetries: 5,
    });

    async function fetchFn(cursor?: string) {
      const res = await endpoint(client)(100, cursor);
      const data = res.results.map((datum) => datum.properties);
      const nextCursor = res.paging?.next?.after;
      return { data, cursor: nextCursor };
    }

    await syncData({ accessToken, organisationId, oauthConnectionId })(
      fetchFn,
      OauthIntegration.HUBSPOT,
      syncedDataType
    );
  };
}