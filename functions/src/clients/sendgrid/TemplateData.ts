import { TemplateName } from "./TemplateName";

export type TemplateData = {
  [TemplateName.INVITE]: {
    organisationName: string;
    inviterName: string;
    inviteLink: string;
  };
  [TemplateName.CALL_PROCESSED]: {
    addressee: string,
    callLink: string
  };
};
