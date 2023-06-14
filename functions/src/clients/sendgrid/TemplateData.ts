import { TemplateName } from "./TemplateName";

export type TemplateData = {
  [TemplateName.INVITE]: {
    organisationName: string;
    inviterName: string;
    inviteLink: string;
  };
  [TemplateName.RECORDING_PROCESSED]: {
    addressee: string,
    recordingLink: string
  };
};
