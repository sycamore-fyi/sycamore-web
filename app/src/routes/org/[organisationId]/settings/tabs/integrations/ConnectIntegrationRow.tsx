import { postServer } from "@/lib/callServer";
import { v4 as uuid } from "uuid";
import { LocalStorageKey } from "@/lib/LocalStorageKey";
import { OauthIntegration } from "@sycamore-fyi/shared";
import { toHeaderCase } from "js-convert-case";
import { useParams } from "react-router-dom";
import { logoUrlFromIntegration } from "./logoUrlFromIntegration";

export function ConnectIntegrationRow({ integration }: { integration: OauthIntegration; }) {
  const { organisationId } = useParams();

  const handleRedirect = async () => {
    const stateId = uuid();

    localStorage.setItem(LocalStorageKey.OAUTH_STATE_ID, stateId);

    const res = await postServer(`/oauth/${integration.toLowerCase()}/auth-url`, {
      organisationId,
      stateId
    });
    const { authUrl } = res.data;
    window.location.href = authUrl;
  };

  return (
    <div
      key={`integration-row-${integration}`}
      className="flex items-center gap-4 py-2 cursor-pointer hover:opacity-60"
      onClick={handleRedirect}
    >
      <img className="w-8 h-8 rounded-sm" src={logoUrlFromIntegration(integration)} alt={integration} />
      {toHeaderCase(integration)}
    </div>
  );
}
