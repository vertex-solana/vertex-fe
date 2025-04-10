import { ApiConstant, AppConstant } from "@/const";
import Cookie from "js-cookie";
import axios, { AxiosInstance } from "axios";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.SERVICE_URL,
  headers: {
    ...ApiConstant.HEADER_DEFAULT,
    Authorization: `Bearer ${Cookie.get(AppConstant.KEY_TOKEN) || ""}`,
  },
  timeout: ApiConstant.TIMEOUT,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);
