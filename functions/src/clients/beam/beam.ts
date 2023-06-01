import axios from "axios";
import { beamCredentials, getCredentials } from "../firebase/secrets";
import { deepModify } from "../../utils/deepModify";
import { toCamelCase } from "js-convert-case";
import { isValid, parseISO } from "date-fns";

export interface BeamCredentials {
  clientId: string,
  clientSecret: string,
}

export const beam = (
  clientType: "apps" | "api",
  { clientId, clientSecret }: BeamCredentials = getCredentials<BeamCredentials>(beamCredentials),
) => {
  const client = axios.create({
    baseURL: `https://${clientType}.beam.cloud`,
    auth: {
      username: clientId,
      password: clientSecret,
    },
  });

  client.interceptors.response.use((res) => {
    res.data = deepModify(res.data, {
      key: toCamelCase,
      string(value) {
        return isValid(parseISO(value)) ? parseISO(value) : value;
      },
    });

    return res;
  });

  return client;
};
