import axios from "axios";
import { parseCookies } from "nookies";

const { "mycalendar.token": accessToken } = parseCookies();

export const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export function setAuthorizationHeader(token: string) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function cleanAuthorizationHeader() {
  delete api.defaults.headers.common["Authorization"];
}

if (accessToken) {
  setAuthorizationHeader(accessToken);
}
