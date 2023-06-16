import axios from "axios"
// import { HttpMethod } from "@sycamore-fyi/shared"
import { auth } from "./firebase/app";
import { config } from "./config";

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

async function call(
  method: HttpMethod,
  path: string,
  data: { [key: string]: any } = {},
  headers: { [key: string]: string } = {}
) {
  const dataKey = method === HttpMethod.GET ? "params" : "data"
  const requestConfig = {
    url: `${config().SERVER_URL}/internal${path}`,
    method,
    headers,
    [dataKey]: data
  }

  const currUser = auth.currentUser

  if (currUser) {
    const idToken = await currUser.getIdToken()

    // if (cachedIdToken && !isExpired(cachedIdToken)) {
    //   idToken = cachedIdToken
    // } else {
    //   const freshIdToken = await currUser.getIdToken()
    //   cachedIdToken = freshIdToken
    //   idToken = freshIdToken
    // }

    requestConfig.headers.Authorization = `Bearer ${idToken}`
  }

  return axios.request(requestConfig)
}

export async function getServer(path: string, data = {}, headers = {}) {
  return call(HttpMethod.GET, path, data, headers)
}

export async function postServer(path: string, data = {}, headers = {}) {
  return call(HttpMethod.POST, path, data, headers)
}

export async function putServer(path: string, data = {}, headers = {}) {
  return call(HttpMethod.PUT, path, data, headers)
}

export async function deleteServer(path: string, data = {}, headers = {}) {
  return call(HttpMethod.DELETE, path, data, headers)
}
