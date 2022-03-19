import Router from "next/router";
import { createContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import type { FC } from "react";

import { api } from "../services/api";
import {
  decodeAndVerify,
  handleTokens,
  handleSignOut,
} from "../services/authentication";
import type { SessionResponse, User } from "../types/session";

type AuthContextData = {
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  signOut: () => void;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: FC = function AuthProviderComponent({ children }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const { "mycalendar.ruid": refreshToken } = parseCookies();

    if (refreshToken) {
      try {
        api
          .post("/session/refresh", { refresh_token: refreshToken })
          .then(({ data }: SessionResponse) => {
            const { name, email } = decodeAndVerify(data.access_token);

            setUser({ name, email });

            handleTokens(data.access_token, data.refresh_token);
          });
      } catch (error) {
        signOut();
      }
    }
  }, []);

  async function register({ name, email, password }: RegisterData) {
    await api.post("/users", {
      name,
      email,
      password,
    });

    await signIn({ email, password });
  }

  async function signIn({ email, password }: SignInData) {
    const { data }: SessionResponse = await api.post("/session/new", {
      email,
      password,
    });

    const { name } = decodeAndVerify(data.access_token);

    setUser({
      name: name,
      email: email,
    });

    handleTokens(data.access_token, data.refresh_token);

    Router.push("/dashboard");
  }

  function signOut() {
    setUser(null);

    handleSignOut();

    Router.replace("/");
  }

  return (
    <AuthContext.Provider value={{ user, register, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
