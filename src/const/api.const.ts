export const HEADER_DEFAULT = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const TIMEOUT = 90000;

// HTTP Status
export const STT_OK = 200;
export const STT_CREATED = 201;
export const STT_BAD_REQUEST = 400;
export const STT_UNAUTHORIZED = 401;
export const STT_FORBIDDEN = 403;
export const STT_NOT_FOUND = 404;
export const STT_INTERNAL_SERVER = 500;
export const STT_NOT_MODIFIED = 304;

// API Path

// Authentication
export const AUTH = '/auth'
export const GET_NONCE = `${AUTH}/wallet/{walletAddress}/nonce`;
export const POST_LOGIN = `${AUTH}/login`;
export const POST_LOGOUT = `${AUTH}/logout`;

export const GET_ACCOUNT = `/accounts/{accountId}`;
export const UPDATE_USERNAME = "accounts/update-user-name";

// IDL Path
export const GET_IDLS = "/idl-dapp";

export const UPLOAD_IDL = `${GET_IDLS}/upload`;

// Indexer Path
export const GET_INDEXERS = "/indexers";
export const GET_INDEXERS_OWNER = `${GET_INDEXERS}/owner`;

export const GET_INDEXER_DETAIL = `/indexers/{indexerId}`;
export const GET_TABLES_INDEXER = `${GET_INDEXERS}/{indexerId}/tables`;
export const GET_TRIGGER_TRANSFORMER = `${GET_INDEXERS}/{indexerId}/tables/{tableId}/trigger-transformer`;

export const CREATE_INDEXER = `${GET_INDEXERS}/create`;
export const CREATE_TABLE = `${GET_INDEXERS}/{indexerId}/tables/create`;
export const CREATE_TRIGGER_TRANSFORMER = `${GET_INDEXERS}/{indexerId}/register`;
export const UPDATE_TRANSFORMER = `${GET_INDEXERS}/{indexerId}/transformers`;

export const GET_QUERY_LOG = `${GET_INDEXERS}/{indexerId}/query`;
export const EXECUTE_QUERY = `${GET_INDEXERS}/query`;
export const CREATE_QUERY_LOG = `${GET_INDEXERS}/{indexerId}/query`;
