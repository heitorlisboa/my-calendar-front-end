import type { AxiosResponse } from "axios";

export type User = {
  name: string;
  email: string;
};

export interface SessionResponse extends AxiosResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}
