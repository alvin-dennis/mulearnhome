import axios from "axios";
import { clientEnv } from "@/lib/env/env.client";

export const publicGateway = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

publicGateway.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

publicGateway.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
