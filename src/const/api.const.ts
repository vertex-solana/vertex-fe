export const HEADER_DEFAULT = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const TIMEOUT = 90000;

export const BASE_SOURCE = "/dapp-service/";
export const AGENTS_SOURCE = "/agents-service/";
export const EDAS_SERVICE = "/edas-service/";

// HTTP Status
export const STT_OK = 200;
export const STT_CREATED = 201;
export const STT_BAD_REQUEST = 400;
export const STT_UNAUTHORIZED = 401;
export const STT_FORBIDDEN = 403;
export const STT_NOT_FOUND = 404;
export const STT_INTERNAL_SERVER = 500;
export const STT_NOT_MODIFIED = 304;

export const SYNC_TRANSACTION = "/sync-transaction";

// edas
export const GET_EDAS = "./edas/{airdropId}";
export const GET_ELIGIBLE = `./edas/{airdropId}/eligible`;
export const GET_STATUS = `./edas/{airdropId}/status`;
export const GET_TX_CLAIM_AIRDROP = "./edas/{airdropId}/claim";

// Price feed APIs
export const GET_LATEST_PRICE_FEEDS = "/latest_price_feeds";

// Agents chat service
export const GET_AGENTS = "/agents";
export const COUNT_MESSAGES = "/count-messages";

// Account
export const PRE_REGISTER = "/pre-register";

const BASE_EDAS_ACCOUNT = "/edas-account/api";

export const GET_ASSETS = `${BASE_EDAS_ACCOUNT}/asset`;

export const GET_CODE = `${BASE_EDAS_ACCOUNT}/auth/get-code`;
export const LOGIN = `${BASE_EDAS_ACCOUNT}/auth/login`;
export const GET_ACCOUNT = `${BASE_EDAS_ACCOUNT}/account`;
export const GET_REMAINING_CREDIT = `${GET_ACCOUNT}/credits`;

export const POST_2FA_SETUP = `${BASE_EDAS_ACCOUNT}/auth/2fa/setup`;
export const POST_REQUEST_2FA_ACTIVATE = `${BASE_EDAS_ACCOUNT}/auth/2fa/request-activate`;
export const POST_2FA_ACTIVATE = `${BASE_EDAS_ACCOUNT}/auth/2fa/activate`;
export const POST_2FA_DEACTIVATE = `${BASE_EDAS_ACCOUNT}/auth/2fa/deactivate`;
export const GET_X_CONNECT_URL = `${BASE_EDAS_ACCOUNT}/auth/x/connect`;
export const POST_X_CALLBACK = `${BASE_EDAS_ACCOUNT}/auth/x/callback`;
export const POST_DISCONNECT_X = `${BASE_EDAS_ACCOUNT}/auth/x/disconnect`;

export const GET_WALLET = `${BASE_EDAS_ACCOUNT}/wallet`;
export const POST_LINK_WALLET = `${BASE_EDAS_ACCOUNT}/wallet/link`;
export const POST_UNLINK_WALLET = `${BASE_EDAS_ACCOUNT}/wallet/unlink`;

export const POST_WALLET_BALANCE = `${GET_WALLET}/balance`;

export const GET_STATISTIC = `${BASE_EDAS_ACCOUNT}/statistic`;
export const GET_PORTFOLIO = `${GET_ACCOUNT}/{chain}/portfolio`;
export const POST_SYNC_TRANSACTION = `${BASE_EDAS_ACCOUNT}/transactions/sync`;
export const GET_DEPOSIT_LATEST = `${BASE_EDAS_ACCOUNT}/transactions/deposit/latest`;
export const POST_WITHDRAW = `${BASE_EDAS_ACCOUNT}/wallet/withdraw`;

export const GET_LENDING_VOLUME = `/collab/volume`;

export const GET_ELANDER_ELIGIBLE = `${BASE_EDAS_ACCOUNT}/elander/eligible`;

// Point
export const GET_CAMPAIGN_LIST = `${BASE_EDAS_ACCOUNT}/campaign/list`;
export const GET_EARNED_REWARD = `${BASE_EDAS_ACCOUNT}/point-system/earned-reward`;
export const GET_TOP_REWARD = `${BASE_EDAS_ACCOUNT}/point-system/reward/top`;

// Agent
export const GET_AGENT_PORTFOLIO = `${BASE_EDAS_ACCOUNT}/agent/{agent}/portfolio`;
export const POST_DELEGATE = `${BASE_EDAS_ACCOUNT}/agent/{agentName}/delegate`;
export const GET_REDEEM = `${BASE_EDAS_ACCOUNT}/agent/{agentName}/redeem`;
