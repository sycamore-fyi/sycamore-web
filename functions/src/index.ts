import { onObjectFinalized } from "firebase-functions/v2/storage";
import { handleObjectFinalized } from "./triggers/storage/handleObjectFinalized";
import { beamCredentials, hubspotCredentials, openaiCredentials, pineconeCredentials, sendgridCredentials } from "./clients/firebase/secrets";
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

const user = functions.region("europe-west1").auth.user();

setGlobalOptions({
  region: "europe-west1",
  maxInstances: 10,
});

export const onExternalHttpRequest = onRequest({
  cors: true,
  secrets: [
    openaiCredentials.name,
    sendgridCredentials.name,
    hubspotCredentials.name,
  ],
}, handleHttpRequest);

export const onStorageObjectFinalized = onObjectFinalized({
  secrets: [
    openaiCredentials.name,
    beamCredentials.name,
    pineconeCredentials.name,
  ],
  timeoutSeconds: 60 * 9,
}, handleObjectFinalized);

export const onPipelineTaskChanged = onDocumentWritten({
  document: `${CollectionName.PIPELINE_TASK}/{id}`,
  secrets: [
    beamCredentials.name,
  ],
}, handlePipelineTaskChange);

export const onMembershipChanged = onDocumentWritten(`${CollectionName.MEMBERSHIP}/{id}`, handleMembershipChange);
export const onOrganisationChanged = onDocumentWritten(`${CollectionName.ORGANISATION}/{id}`, handleOrganisationChange);
export const onUserChanged = onDocumentWritten(`${CollectionName.USER}/{id}`, handleUserChange);

export const onAuthUserCreated = user.onCreate(handleAuthUserCreated);
export const onAuthUserDeleted = user.onDelete(handleAuthUserDeleted);


