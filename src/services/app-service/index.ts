import {
  CREATE_INDEXER,
  CREATE_QUERY_LOG,
  CREATE_TABLE,
  CREATE_TRIGGER_TRANSFORMER,
  EXECUTE_QUERY,
  GET_IDLS,
  GET_INDEXER_DETAIL,
  GET_INDEXERS,
  GET_INDEXERS_OWNER,
  GET_QUERY_LOG,
  GET_TABLES_INDEXER,
  GET_TRIGGER_TRANSFORMER,
  UPDATE_TRANSFORMER,
  UPLOAD_IDL,
} from "@/const/api.const";
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
  IdlDappResponse,
  IndexerResponse,
  IndexerTableMetadata,
  QueryLogResponse,
  TriggerAndTransformer,
} from "@/models/app.model";
import { CommonUtils } from "@/utils";
import StringFormat from "string-format";

export const getAllIndexers = async (
  params: GetAllIndexersParams
): Promise<DataListInterface<IndexerResponse[]> | undefined> => {
  try {
    const queryParams = {
      ...params,
    };

    const response: AxiosResponse<ResponseDataList<IndexerResponse[]>> =
      await axiosInstance.get(GET_INDEXERS, {
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
      await axiosInstance.get(GET_INDEXERS_OWNER, {
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
      await axiosInstance.get(GET_IDLS, {
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

    await axiosInstance.post(UPLOAD_IDL, formData, {
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
    await axiosInstance.post(CREATE_INDEXER, payload);
  } catch (error) {
    console.error("Error creating indexer:", error);
    throw error;
  }
};

export const getIndexerDetails = async (
  indexerId: number
): Promise<IndexerResponse | undefined> => {
  try {
    const apiUrl = StringFormat(GET_INDEXER_DETAIL, { indexerId });

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
    const apiUrl = StringFormat(GET_TABLES_INDEXER, { indexerId });

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
    const apiUrl = StringFormat(GET_TRIGGER_TRANSFORMER, {
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
    const apiUrl = StringFormat(CREATE_TABLE, {
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

    const apiUrl = StringFormat(CREATE_TRIGGER_TRANSFORMER, {
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
    const apiUrl = StringFormat(UPDATE_TRANSFORMER, {
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
      await axiosInstance.post(EXECUTE_QUERY, { query });

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
    const apiUrl = StringFormat(GET_QUERY_LOG, { indexerId });

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
    const apiUrl = StringFormat(CREATE_QUERY_LOG, {
      indexerId: payload.indexerId,
    });

    await axiosInstance.post(apiUrl, payload);
  } catch (error) {
    console.error("Error creating query log:", error);
    throw error;
  }
};
