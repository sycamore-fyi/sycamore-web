import * as path from "path";
import * as fs from "fs";
import * as handlebars from "handlebars";
import { TemplateName } from "./TemplateName";
import { RuntimeOptions } from "handlebars";
import { wrapTemplate } from "./wrapTemplate";

const templateCache: { [key: string]: handlebars.TemplateDelegate } = {};

export async function getTemplate<T>(templateName: TemplateName) {
  if (templateName in templateCache) return templateCache[templateName];

  const filePath = path.join(__dirname, "templates", `${templateName}.handlebars`);
  const source = await fs.promises.readFile(filePath, { encoding: "utf-8" });
  const template = handlebars.compile<T>(source);

  templateCache[templateName] = template;

  return (context: T, runtimeOptions?: RuntimeOptions) => {
    const compiled = template(context, runtimeOptions);
    return wrapTemplate(compiled);
  };
}
