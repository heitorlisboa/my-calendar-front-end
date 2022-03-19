import jwt from "jsonwebtoken";
import { setCookie, destroyCookie } from "nookies";

import { setAuthorizationHeader, cleanAuthorizationHeader } from "./api";
import type { User } from "../types/session";

export interface UserJwtPayload extends User, jwt.JwtPayload {}

export function decodeAndVerify(accessToken: string) {
  jwt.verify(accessToken, process.env.NEXT_PUBLIC_SECRET_KEY as string);

  return jwt.decode(accessToken) as UserJwtPayload;
}

export function handleTokens(accessToken: string, refreshToken: string) {
  setCookie(undefined, "mycalendar.token", accessToken, {
    maxAge: 60 * 15, // 15 minutes
  });

  setCookie(undefined, "mycalendar.ruid", refreshToken, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  setAuthorizationHeader(accessToken);
}

export function handleSignOut() {
  destroyCookie(undefined, "mycalendar.token");
  destroyCookie(undefined, "mycalendar.ruid");
  cleanAuthorizationHeader();
}
