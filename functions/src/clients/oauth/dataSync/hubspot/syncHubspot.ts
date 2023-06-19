import { SyncedDataType } from "@sycamore-fyi/shared";
import { syncHubspotData } from "./syncHubspotData";
import { SyncRequest } from "../syncData";

export async function syncHubspot(args: SyncRequest) {
  const syncer = syncHubspotData(args);
  await Promise.all([
    syncer(SyncedDataType.CALL, (client) => client.crm.objects.calls.basicApi.getPage),
    syncer(SyncedDataType.MEETING, (client) => client.crm.objects.meetings.basicApi.getPage),
  ]);
}
