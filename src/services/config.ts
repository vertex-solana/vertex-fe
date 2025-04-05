import { ApiConstant, AppConstant } from "@/const";
import apisauce, { ApiResponse, ApisauceConfig } from "apisauce";
import Cookie from "js-cookie";

const DEFAULT_CONFIG: ApisauceConfig = {
  baseURL: ApiConstant.BASE_SOURCE,
  headers: { ...ApiConstant.HEADER_DEFAULT },
  timeout: ApiConstant.TIMEOUT,
};

const handleErrorRequest = (response: ApiResponse<ApiResponseInterface>) => {
  if (
    response.status &&
    ![ApiConstant.STT_OK, ApiConstant.STT_CREATED].includes(response.status)
  ) {
    console.log(response);
  }
};

const Api = apisauce.create(DEFAULT_CONFIG);
export default Api;
Api.addResponseTransform(handleErrorRequest);

const createInstance = (token?: string, apiKey?: string) => {
  const newToken = token || Cookie.get(AppConstant.KEY_TOKEN);
  newToken && Api.setHeader("Authorization", `Bearer ${newToken}`);

  if (apiKey) {
    Api.setHeader("x-api-key", apiKey);
  }

  return Api;
};

export const createDappServices = (token?: string, apiKey?: string) =>
	createInstance(token, apiKey);

export const createAgentServices = (config?: any) => {
  const newConfig = {
    ...DEFAULT_CONFIG,
    baseURL: ApiConstant.AGENTS_SOURCE,
    ...config,
  };

  const newApi = apisauce.create(newConfig);
  const token = Cookie.get(AppConstant.KEY_TOKEN);
  token && newApi.setHeader("Authorization", `Bearer ${token}`);
  return newApi;
};

export interface ApiResponseInterface {
  status: number;
  data: object;
}

export const createPriceFeedApi = (baseURL: string) => {
  const newConfig = {
    ...DEFAULT_CONFIG,
    baseURL,
  };

  const newApi = apisauce.create(newConfig);
  return newApi;
};
