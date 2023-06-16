export type GrantRequest = {
  client_id: string;
  client_secret: string;
  redirect_uri: string;
} & (
    {
      grant_type: "authorization_code";
      code: string;
    } | {
      grant_type: "refresh_token";
      refresh_token: string;
    });
