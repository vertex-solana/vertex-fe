import { ApiConstant } from "@/const";
import { useAppContext } from "@/context";
import {
  createIndexer,
  createQueryLog,
  createTable,
  createTriggerAndTransformer,
  executeQuery,
  getAllIndexers,
  getAllQueryLog,
  getIdls,
  getIndexerDetails,
  getIndexerOwner,
  getTablesInIndexer,
  getTriggersAndTransformers,
  updateTransformerScript,
  uploadIdl,
} from "@/services/app-service";
import {
  CreateIndexerPayload,
  CreateQueryLogPayload,
  CreateTablePayload,
  CreateTriggerAndTransformerPayload,
  UpdateTransformerScriptPayload,
  UploadIdlPayload,
} from "@/services/app-service/interface";
import { axiosInstance } from "@/services/config";
import { isNil } from "lodash";
import StringFormat from "string-format";

const useAppHooks = () => {
  const { setUserInfo } = useAppContext();

  const handleGetUserInfo = async (accountId: number) => {
    try {
      const apiUrl = StringFormat(ApiConstant.GET_ACCOUNT, { accountId });

      const response = await axiosInstance.get(apiUrl);

      if (response.status === ApiConstant.STT_OK) {
        setUserInfo(response.data.data);
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetAllIndexers = async (params: {
    pageNum?: number;
    pageSize?: number;
  }) => {
    if (isNil(params.pageNum)) {
      params.pageNum = 1;
    }

    if (isNil(params.pageSize)) {
      params.pageSize = 10;
    }

    return await getAllIndexers(params);
  };

  const handleGetIndexersOwner = async (params: {
    pageNum?: number;
    pageSize?: number;
  }) => {
    if (isNil(params.pageNum)) {
      params.pageNum = 1;
    }

    if (isNil(params.pageSize)) {
      params.pageSize = 10;
    }

    return await getIndexerOwner(params);
  };

  const handleGetIdls = async (params: {
    pageNum?: number;
    pageSize?: number;
  }) => {
    if (isNil(params.pageNum)) {
      params.pageNum = 1;
    }

    if (isNil(params.pageSize)) {
      params.pageSize = 10;
    }

    return await getIdls(params);
  };

  const handleUploadIdl = async (payload: UploadIdlPayload) => {
    return await uploadIdl(payload);
  };

  const handleCreateIndexer = async (payload: CreateIndexerPayload) => {
    return await createIndexer(payload);
  };

  const handleGetIndexerDetail = async (indexerId: number) => {
    return await getIndexerDetails(indexerId);
  };

  const handleGetTablesInIndexer = async (indexerId: number) => {
    return await getTablesInIndexer(indexerId);
  };

  const handleGetTriggersAndTransformers = async (
    indexerId: number,
    tableId: number
  ) => {
    return await getTriggersAndTransformers(indexerId, tableId);
  };

  const handleCreateTable = async (payload: CreateTablePayload) => {
    return await createTable(payload);
  };

  const handlerCreateTriggerAndTransformer = async (
    payload: CreateTriggerAndTransformerPayload
  ) => {
    return await createTriggerAndTransformer(payload);
  };

  const handleUpdateTransformerScript = async (
    payload: UpdateTransformerScriptPayload
  ) => {
    return await updateTransformerScript(payload);
  };

  const handleExecuteQuery = async (query: string) => {
    return await executeQuery(query);
  };

  const handleGetAllQueryLogs = async (indexerId: number) => {
    return await getAllQueryLog(indexerId);
  };

  const handleCreateQueryLog = async (payload: CreateQueryLogPayload) => {
    return await createQueryLog(payload);
  };

  return {
    handleGetUserInfo,

    handleGetIdls,
    handleUploadIdl,

    handleGetAllIndexers,
    handleGetIndexersOwner,
    handleGetIndexerDetail,
    handleGetTablesInIndexer,
    handleGetTriggersAndTransformers,

    handleCreateIndexer,
    handleCreateTable,
    handlerCreateTriggerAndTransformer,
    handleUpdateTransformerScript,

    handleExecuteQuery,
    handleGetAllQueryLogs,
    handleCreateQueryLog,
  };
};

export default useAppHooks;
