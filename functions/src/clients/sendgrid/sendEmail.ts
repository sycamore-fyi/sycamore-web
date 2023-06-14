import { getTemplate } from "./getTemplate";
import { sendgrid } from "./sendgrid";
import { subjects } from "./subjects";
import { TemplateData } from "./TemplateData";

const fromEmail = "matthew.ffrench@sycamore.fyi";

export const sendEmail = <T extends keyof TemplateData>(templateName: T) => async (sends: {
  toEmail: string,
  data: TemplateData[T],
}[]) => {
  const template = await getTemplate<TemplateData[T]>(templateName);

  const sendData = sends.map((send) => {
    const html = template(send.data);
    const subject = subjects[templateName](send.data);

    return {
      from: fromEmail,
      replyTo: fromEmail,
      to: send.toEmail,
      subject,
      html,
    };
  });

  await sendgrid().send(sendData);
};
