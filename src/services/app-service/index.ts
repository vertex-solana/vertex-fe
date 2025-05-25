import { axiosInstance } from "../config";
import {
  CreateIndexerPayload,
  CreateQueryLogPayload,
  CreateTablePayload,
  CreateTriggerAndTransformerPayload,
  GetAllIdlsParams,
  GetAllIndexersParams,
  UpdateTransformerScriptPayload,
  UploadIdlPayload,
} from "./interface";
import { AxiosResponse } from "axios";
import {
  BaseResponseData,
  DataListInterface,
  ResponseDataList,
} from "@/models/common.model";
import {
  ExecuteQueryResponse,
  GetNonceResponse,
  IdlDappResponse,
  IndexerResponse,
  IndexerTableMetadata,
  PostLoginResponse,
  QueryLogResponse,
  TriggerAndTransformer,
} from "@/models/app.model";
import { CommonUtils } from "@/utils";
import StringFormat from "string-format";
import { ApiConstant } from "@/const";

export const getNonceService = async (walletAddress: string) => {
  const apiUrl = StringFormat(ApiConstant.GET_NONCE, { walletAddress });

  const response: AxiosResponse<BaseResponseData<GetNonceResponse>> =
    await axiosInstance.get(apiUrl);

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return responseData as GetNonceResponse;
  } else {
    return undefined;
  }
};

export const postLoginService = async (
  walletAddress: string,
  signature: string
) => {
  const apiUrl = ApiConstant.POST_LOGIN;

  const response: AxiosResponse<BaseResponseData<PostLoginResponse>> =
    await axiosInstance.post(apiUrl, {
      walletAddress,
      signature,
    });

  const responseData = CommonUtils.getDappServicesResponseData(response);

  if (responseData) {
    return {
      accessToken: responseData.accessToken,
      refreshToken: responseData?.refreshToken || "",
    } as PostLoginResponse;
  } else {
    return { accessToken: "", refreshToken: "" } as PostLoginResponse;
  }
};

export const getAllIndexers = async (
  params: GetAllIndexersParams
): Promise<DataListInterface<IndexerResponse[]> | undefined> => {
  try {
    const queryParams = {
      ...params,
    };

    const response: AxiosResponse<ResponseDataList<IndexerResponse[]>> =
      await axiosInstance.get(ApiConstant.GET_INDEXERS, {
        params: queryParams,
      });

    const responseData = CommonUtils.getDappServicesResponseData(response);

    if (responseData) {
      return responseData;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching indexers:", error);
    throw error;
  }
};

export const getIndexerOwner = async (
  params: GetAllIndexersParams
): Promise<DataListInterface<IndexerResponse[]> | undefined> => {
  try {
    const queryParams = {
      ...params,
    };

    const response: AxiosResponse<ResponseDataList<IndexerResponse[]>> =
      await axiosInstance.get(ApiConstant.GET_INDEXERS_OWNER, {
        params: queryParams,
      });

    const responseData = CommonUtils.getDappServicesResponseData(response);

    if (responseData) {
      return responseData;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching indexers:", error);
    throw error;
  }
};

export const getIdls = async (
  params: GetAllIdlsParams
): Promise<DataListInterface<IdlDappResponse[]> | undefined> => {
  try {
    const queryParams = {
      ...params,
    };

    const response: AxiosResponse<ResponseDataList<IdlDappResponse[]>> =
      await axiosInstance.get(ApiConstant.GET_IDLS, {
        params: queryParams,
      });

    const responseData = CommonUtils.getDappServicesResponseData(response);

    if (responseData) {
      return responseData;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching idls:", error);
    throw error;
  }
};

export const uploadIdl = async (payload: UploadIdlPayload): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("programId", payload.programId.trim());
    formData.append("version", payload.version.trim());
    formData.append("name", payload.name.trim());
    formData.append("idlJson", payload.idlFile);

    await axiosInstance.post(ApiConstant.UPLOAD_IDL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error uploading IDL:", error);
    throw error;
  }
};

export const createIndexer = async (
  payload: CreateIndexerPayload
): Promise<void> => {
  try {
    await axiosInstance.post(ApiConstant.CREATE_INDEXER, payload);
  } catch (error) {
    console.error("Error creating indexer:", error);
    throw error;
  }
};

export const getIndexerDetails = async (
  indexerId: number
): Promise<IndexerResponse | undefined> => {
  try {
    const apiUrl = StringFormat(ApiConstant.GET_INDEXER_DETAIL, { indexerId });

    const response: AxiosResponse<BaseResponseData<IndexerResponse>> =
      await axiosInstance.get(apiUrl);

    const responseData = CommonUtils.getDappServicesResponseData(response);
    if (responseData) {
      return responseData;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching indexer details:", error);
    throw error;
  }
};

export const getTablesInIndexer = async (
  indexerId: number
): Promise<IndexerTableMetadata[] | undefined> => {
  try {
    const apiUrl = StringFormat(ApiConstant.GET_TABLES_INDEXER, { indexerId });

    const response: AxiosResponse<BaseResponseData<IndexerTableMetadata[]>> =
      await axiosInstance.get(apiUrl);

    const responseData = CommonUtils.getDappServicesResponseData(response);
    if (responseData) {
      return responseData;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching indexer details:", error);
    throw error;
  }
};

export const getTriggersAndTransformers = async (
  indexerId: number,
  tableId: number
): Promise<TriggerAndTransformer[] | undefined> => {
  try {
    const apiUrl = StringFormat(ApiConstant.GET_TRIGGER_TRANSFORMER, {
      indexerId,
      tableId,
    });

    const response: AxiosResponse<BaseResponseData<TriggerAndTransformer[]>> =
      await axiosInstance.get(apiUrl);

    const responseData = CommonUtils.getDappServicesResponseData(response);
    if (responseData) {
      return responseData;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error fetching trigger and transformer details:", error);
    throw error;
  }
};

export const createTable = async (
  payload: CreateTablePayload
): Promise<void> => {
  try {
    const apiUrl = StringFormat(ApiConstant.CREATE_TABLE, {
      indexerId: payload.indexerId,
    });

    await axiosInstance.post(apiUrl, payload);
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
};

export const createTriggerAndTransformer = async (
  payload: CreateTriggerAndTransformerPayload
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("tableId", payload.tableId.toString());
    formData.append("triggerType", payload.triggerType);
    formData.append("pdaPubkey", payload.pdaPubkey.trim());
    formData.append("pdaName", payload.pdaName.trim());
    const blob = new Blob([payload.transformCode], { type: "text/javascript" });
    formData.append("transformer", blob, "transform.js");

    const apiUrl = StringFormat(ApiConstant.CREATE_TRIGGER_TRANSFORMER, {
      indexerId: payload.indexerId,
    });

    await axiosInstance.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Error creating trigger and transformer:", error);
    throw error;
  }
};

export const updateTransformerScript = async (
  payload: UpdateTransformerScriptPayload
): Promise<void> => {
  try {
    const apiUrl = StringFormat(ApiConstant.UPDATE_TRANSFORMER, {
      indexerId: payload.indexerId,
    });

    await axiosInstance.patch(apiUrl, {
      script: payload.script,
      transformerId: payload.transformerId,
    });
  } catch (error) {
    console.error("Error updating transformer script:", error);
    throw error;
  }
};

export const executeQuery = async (
  query: string
): Promise<ExecuteQueryResponse | undefined> => {
  try {
    const response: AxiosResponse<BaseResponseData<ExecuteQueryResponse>> =
      await axiosInstance.post(ApiConstant.EXECUTE_QUERY, { query });

    const responseData = CommonUtils.getDappServicesResponseData(response);

    if (responseData) {
      return responseData;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

export const getAllQueryLog = async (
  indexerId: number
): Promise<QueryLogResponse[] | undefined> => {
  try {
    const apiUrl = StringFormat(ApiConstant.GET_QUERY_LOG, { indexerId });

    const response: AxiosResponse<BaseResponseData<QueryLogResponse[]>> =
      await axiosInstance.get(apiUrl);

    const responseData = CommonUtils.getDappServicesResponseData(response);
    if (responseData) {
      return responseData;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting query logs:", error);
    throw error;
  }
};

export const createQueryLog = async (
  payload: CreateQueryLogPayload
): Promise<void> => {
  try {
    const apiUrl = StringFormat(ApiConstant.CREATE_QUERY_LOG, {
      indexerId: payload.indexerId,
    });

    await axiosInstance.post(apiUrl, payload);
  } catch (error) {
    console.error("Error creating query log:", error);
    throw error;
  }
};
