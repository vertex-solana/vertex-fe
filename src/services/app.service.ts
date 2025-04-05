import {
  createDappServices,
  createPriceFeedApi,
  createAgentServices,
} from "./config";

import {
  AssetInterface,
  SupportTokenType,
  SupportedChainEnum,
  ElanderEligibleInterface,
  PriceFeedsResponseInterface,
} from "@/models";

import { isNil } from "lodash";
import { Map } from "immutable";
import { CommonUtils } from "@/utils";
import { ApiConstant } from "@/const";
import { ApiResponse } from "apisauce";
import { BaseResponseData } from "@/models/common.model";

export const getUserInfoService = () => {
  return {
    status: 200,
    data: {
      userName: "Pando Infinity",
      address: "Mac Plaza",
      email: "pando@infinity.com",
    },
  };
};

export const syncTransaction = async (
  transactionHash: string,
  network: SupportedChainEnum,
  transactionType?: string
) => {
  const apiUrl = ApiConstant.SYNC_TRANSACTION;
  await createDappServices().post(apiUrl, {
    transactionHash,
    network,
    transactionType,
  });
};

export const getSolPrice = async () => {
  const priceFeedId = process.env.NEXT_PUBLIC_SOL_PRICE_FEED_ID;

  const queryString = `?ids[]=${priceFeedId}&`;

  const url = ApiConstant.GET_LATEST_PRICE_FEEDS + queryString;

  const response: ApiResponse<PriceFeedsResponseInterface[]> =
    await createPriceFeedApi(process.env.PRICE_FEED_SERVICE_URL || "").get(url);

  if (!response.status) return 0;

  if (response.status >= 200 && response.status < 300) {
    const data = response.data;
    const price = data
      ? Number(data[0].price.price) * Math.pow(10, data[0].price.expo)
      : 0;

    return price;
  } else {
    return 0;
  }
};

export const getAssetsService = async () => {
  const apiUrl = ApiConstant.GET_ASSETS;

  const response: ApiResponse<BaseResponseData<AssetInterface[]>> =
    await createAgentServices().get(apiUrl);

  const responseData = response.data;

  return responseData;
};

export const getPythTokensPriceFeedService = async (
  availableAssets: Map<SupportTokenType, AssetInterface>
) => {
  if (!availableAssets.size) return undefined;
  const assets = Array.from(availableAssets, ([, asset]) => asset).filter(
    (asset) => !isNil(asset.priceFeedId)
  );
  if (assets.length == 0) return undefined;
  let queryString = "?";

  assets.forEach((asset) => {
    queryString += `ids[]=${asset.priceFeedId}&`;
  });

  const url = ApiConstant.GET_LATEST_PRICE_FEEDS + queryString;

  const response: ApiResponse<PriceFeedsResponseInterface[]> =
    await createPriceFeedApi(assets[0]?.priceFeedProvider?.url + "/api").get(
      url
    );

  if (!response.status) return undefined;

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
};

export const getElanderEligibleService = async () => {
  const response: ApiResponse<BaseResponseData<ElanderEligibleInterface>> =
    await createAgentServices().get(ApiConstant.GET_ELANDER_ELIGIBLE);

  const responseData =
    CommonUtils.getDappServicesResponseData<ElanderEligibleInterface>(response);

  if (responseData) {
    return responseData as ElanderEligibleInterface;
  } else {
    return {} as ElanderEligibleInterface;
  }
};
