import * as setupTest from "firebase-functions-test"
import * as functions from "../../../src/index"

const test = setupTest({
  projectId: "sycamore-staging",
  storageBucket: "sycamore-staging.appspot.com",
}, "./firebase_service_account_staging.json")

export const testOnAuthUserCreated = test.wrap(functions.onAuthUserCreated)
export const testOnAuthUserDeleted = test.wrap(functions.onAuthUserDeleted)
export const testOnMembershipChanged = test.wrap(functions.onMembershipChanged)
export const testOnOrganisationChanged = test.wrap(functions.onOrganisationChanged)
export const testOnStorageObjectFinalized = test.wrap(functions.onStorageObjectFinalized)
