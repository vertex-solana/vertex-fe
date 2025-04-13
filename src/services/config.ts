import { ApiConstant, AppConstant } from "@/const";
import Cookie from "js-cookie";
import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.SERVICE_URL,
  headers: {
    ...ApiConstant.HEADER_DEFAULT,
  },
  timeout: ApiConstant.TIMEOUT,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookie.get(AppConstant.KEY_TOKEN) || "";
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);
