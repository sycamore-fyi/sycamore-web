import { TemplateData } from "./TemplateData";
import { TemplateName } from "./TemplateName";

export const subjects: { [key in TemplateName]: (data: TemplateData[key]) => string } = {
  [TemplateName.INVITE]: (data) => `${data.inviterName} invited you to join ${data.organisationName} on Sycamore`,
  [TemplateName.CALL_PROCESSED]: () => "Your call is ready",
};
