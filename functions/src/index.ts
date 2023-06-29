import { onObjectFinalized } from "firebase-functions/v2/storage";
import { handleObjectFinalized } from "./triggers/storage/handleObjectFinalized";
import { beamCredentials, googleWorkspaceCredentials, hubspotCredentials, openaiCredentials, pineconeCredentials, sendgridCredentials, slackCredentials, zoomCredentials } from "./clients/firebase/secrets";
import * as functions from "firebase-functions";
import { handleAuthUserCreated } from "./triggers/auth/handlers/handleAuthUserCreated";
import { setGlobalOptions } from "firebase-functions/v2";
import { handleAuthUserDeleted } from "./triggers/auth/handlers/handleAuthUserDeleted";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { CollectionName } from "@sycamore-fyi/shared";
import { handleMembershipChange } from "./triggers/firestore/handlers/handleMembershipChange";
import { onRequest } from "firebase-functions/v2/https";
import { handleHttpRequest } from "./triggers/http/handleHttpRequest";
import { handleOrganisationChange } from "./triggers/firestore/handlers/handleOrganisationChange";
import { handlePipelineTaskChange } from "./triggers/firestore/handlers/handlePipelineTaskChange";
import { handleUserChange } from "./triggers/firestore/handlers/handleUserChange";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { handleEveryDay } from "./triggers/cron/handleEveryDay";
import { handleOauthConnectionChange } from "./triggers/firestore/handlers/handleOauthConnectionChange";
import { handleSlack } from "./triggers/http/slack/handleSlack";
import { handleInstantMessageChange } from "./triggers/firestore/handlers/handleSlackMessageChange";
import { handleInstantMessageChannelMembershipChange } from "./triggers/firestore/handlers/handleChannelMembershipChange";

const user = functions.region("europe-west1").auth.user();

setGlobalOptions({
  region: "europe-west1",
  maxInstances: 10,
});

const oauthSecrets = [
  hubspotCredentials.name,
  zoomCredentials.name,
  slackCredentials.name,
  googleWorkspaceCredentials.name,
];

export const onExternalHttpRequest = onRequest({
  cors: true,
  secrets: [
    openaiCredentials.name,
    sendgridCredentials.name,
    ...oauthSecrets,
  ],
}, handleHttpRequest);

export const slack = onRequest({
  cors: true,
  secrets: [
    slackCredentials.name,
    openaiCredentials.name,
    pineconeCredentials.name,
  ],
}, handleSlack);

export const onSlackMessageChange = onDocumentWritten({
  secrets: [
    slackCredentials.name,
    openaiCredentials.name,
    pineconeCredentials.name,
  ],
  document: `${CollectionName.INSTANT_MESSAGE}/{id}`,
}, handleInstantMessageChange);

export const onChannelMembershipChange = onDocumentWritten({
  secrets: [
    slackCredentials.name,
    openaiCredentials.name,
    pineconeCredentials.name,
  ],
  document: `${CollectionName.INSTANT_MESSAGE_CHANNEL_MEMBERSHIP}/{id}`,
}, handleInstantMessageChannelMembershipChange);

export const onStorageObjectFinalized = onObjectFinalized({
  secrets: [
    openaiCredentials.name,
    beamCredentials.name,
    pineconeCredentials.name,
    sendgridCredentials.name,
  ],
  timeoutSeconds: 60 * 9,
  memory: "8GiB",
  cpu: 2,
}, handleObjectFinalized);

export const onEveryDay = onSchedule({
  schedule: "0 * * * *",
  secrets: [
    ...oauthSecrets,
  ],
}, handleEveryDay);

export const onPipelineTaskChanged = onDocumentWritten({
  document: `${CollectionName.PIPELINE_TASK}/{id}`,
  secrets: [
    beamCredentials.name,
  ],
}, handlePipelineTaskChange);

export const onMembershipChanged = onDocumentWritten(`${CollectionName.MEMBERSHIP}/{id}`, handleMembershipChange);
export const onOauthConnectionChanged = onDocumentWritten({
  document: `${CollectionName.OAUTH_CONNECTION}/{id}`,
  secrets: [
    ...oauthSecrets,
  ],
  timeoutSeconds: 60 * 9,
}, handleOauthConnectionChange);
export const onOrganisationChanged = onDocumentWritten(`${CollectionName.ORGANISATION}/{id}`, handleOrganisationChange);
export const onUserChanged = onDocumentWritten(`${CollectionName.USER}/{id}`, handleUserChange);

export const onAuthUserCreated = user.onCreate(handleAuthUserCreated);
export const onAuthUserDeleted = user.onDelete(handleAuthUserDeleted);


