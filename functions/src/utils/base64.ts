export const decode = (value: string) => Buffer.from(value, "base64").toString("utf8");

export const encode = (value: string) => Buffer.from(value, "utf8").toString("base64");
