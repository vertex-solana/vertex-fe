import {
  SupportedChainEnum,
  EdasAirdropInterface,
  AirdropStatusInterface,
  AirdropEligibleInterface,
  TxAirDropResponseInterface,
} from "@/models";
import { ApiConstant } from "@/const";
import { CommonUtils } from "@/utils";
import { ApiResponse } from "apisauce";
import { createDappServices } from "./config";
import { BaseResponseData } from "@/models/common.model";

import StringFormat from "string-format";

export const getAdasAirDrop = async (airdropId: number) => {
  const apiUrl = StringFormat(ApiConstant.GET_EDAS, { airdropId });

  const response: ApiResponse<BaseResponseData<EdasAirdropInterface>> =
    await createDappServices().get(apiUrl);

  const responseData =
    CommonUtils.getDappServicesResponseData<EdasAirdropInterface>(response);

  if (responseData) {
    return responseData as EdasAirdropInterface;
  } else {
    return undefined;
  }
};

export const getAirdropEligibleService = async (
  airdropId: number,
  walletAddress: string,
  network: SupportedChainEnum
) => {
  const apiUrl = StringFormat(ApiConstant.GET_ELIGIBLE, { airdropId });

  const response: ApiResponse<BaseResponseData<AirdropEligibleInterface>> =
    await createDappServices().get(apiUrl, { walletAddress, network });

  const responseData =
    CommonUtils.getDappServicesResponseData<AirdropEligibleInterface>(response);

  if (responseData) {
    return responseData as AirdropEligibleInterface;
  } else {
    return undefined;
  }
};

export const getAirdropStatusService = async (
  airdropId: number,
  walletAddress: string,
  network: SupportedChainEnum
) => {
  const apiUrl = StringFormat(ApiConstant.GET_STATUS, { airdropId });

  const response: ApiResponse<BaseResponseData<AirdropStatusInterface>> =
    await createDappServices().get(apiUrl, { walletAddress, network });

  const responseData =
    CommonUtils.getDappServicesResponseData<AirdropStatusInterface>(response);

  if (responseData) {
    return responseData;
  } else {
    return undefined;
  }
};

export const getTxClaimAirdropService = async (
  airdropId: number,
  walletAddress: string,
  network: SupportedChainEnum
) => {
  const apiUrl = StringFormat(ApiConstant.GET_TX_CLAIM_AIRDROP, { airdropId });

  const response: ApiResponse<BaseResponseData<TxAirDropResponseInterface>> =
    await createDappServices().post(apiUrl, { walletAddress, network });

  const responseData =
    CommonUtils.getDappServicesResponseData<TxAirDropResponseInterface>(
      response
    );

  if (responseData) {
    return responseData;
  } else {
    return undefined;
  }
};
