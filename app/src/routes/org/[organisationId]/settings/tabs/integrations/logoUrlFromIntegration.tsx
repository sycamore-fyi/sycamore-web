import hubspotLogoUrl from "@/assets/hubspot-logo.png";
import salesforceLogoUrl from "@/assets/salesforce-logo.png";
import slackLogoUrl from "@/assets/slack-logo.png";
import zoomLogoUrl from "@/assets/zoom-logo.png";
import { OauthIntegration } from "@sycamore-fyi/shared";


export function logoUrlFromIntegration(integration: OauthIntegration) {
  switch (integration) {
    case OauthIntegration.HUBSPOT: return hubspotLogoUrl;
    case OauthIntegration.SALESFORCE: return salesforceLogoUrl;
    case OauthIntegration.SLACK: return slackLogoUrl;
    case OauthIntegration.ZOOM: return zoomLogoUrl;
    default: throw new Error("Unsupported integration type");
  }
}
