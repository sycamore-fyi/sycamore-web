import { OauthConnection } from "@sycamore-fyi/shared";
import { Collection } from "../../firebase/firestore/collection";
import { refreshAccessToken } from "../auth/refreshAccessToken";

export async function getAccessToken(connection: OauthConnection, id: string) {
  const { integration, refreshToken } = connection;
  const { refreshToken: newRefreshToken, accessToken } = await refreshAccessToken(integration, refreshToken);

  if (newRefreshToken !== refreshToken) {
    await Collection.OauthConnection.doc(id).update({ refreshToken: newRefreshToken });
  }

  return accessToken;
}
