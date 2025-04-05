import { NetworkModeEnum } from "@/models";
import { Network } from "@aptos-labs/ts-sdk";

export const KEY_TOKEN = "token";
export const COOKIE_EXPIRED_DATE = 7;

export const NOT_HAVE_VALUE_LABEL = "- -";
export const NOT_AVAILABLE_VALUE = "N/A";

export const DEBOUNCE_TIME_IN_MILLISECOND = 500;

export const SIZE_PAGINATION_DEFAULT = 12;
export const DEFAULT_PAGINATION = {
  page: 1,
  size: SIZE_PAGINATION_DEFAULT,
};
export const SORT_DIRECTION = {
  asc: 1,
  desc: -1,
};

export const BREAK_POINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
};

export const SECTION_ID = {
  Home: "home",
  Advantages: "advantages",
};

export const USD_FORMAT = {
  style: "currency",
  currency: "USD",
};

export const SOLANA_PROVIDER = "solana-provider";

export const GOOGLE_ANALYTICS_ID = "G-G2M5X8ZT8R";

export const META_DATA_HOME_DEFAULT = {
  title: "Enso DeFAI Agents Suite (E.D.A.S)",
  description:
    "Deliver DeFAI agents that automate lending, liquidity, and LST strategies across chains for superior returns with minimal effort",
  url: "https://defai.ensofi.xyz/",
  siteName: "Defai",
  urlImage: "https://defai.s3.ap-southeast-1.amazonaws.com/defai_metadata.png",
};

export const META_DATA_EDAS_ACCOUNT = {
  title: "EDAS Account – Easily Manage Your DeFAI Agents",
  description:
    "EDAS Account simplifies DeFi with an easy-to-use, abstracted wallet. Manage DeFAI Agents across all chains in one place. Enjoy secure, automated yield farming with zero hassle.",
  url: "https://defai.ensofi.xyz/",
  siteName: "Defai",
  urlImage: "https://defai.s3.ap-southeast-1.amazonaws.com/defai_metadata.png",
};

export const META_DATA_DAO_ACCOUNT = {
  title: "EDAS DAO – The First DAO for DeFAI Agents",
  description:
    "EDAS DAO puts you in control of the future of EDAS Ecosystem. Stake $EDAS for early access, priority perks, and voting power. Manage DeFAI Agents, shape strategies, and help build a community-driven ecosystem—all while earning rewards.",
  url: "https://defai.ensofi.xyz/",
  siteName: "Defai",
  urlImage: "https://defai.s3.ap-southeast-1.amazonaws.com/defai_metadata.png",
};

export const META_DATA_NFT_CHECKED = {
  title: "E-Lander - Eligibility Whitelist Check",
  description:
    "The Eligibility Whitelist Check allows users to check their whitelist status for the E-Lander Minting Event by connecting their wallets and social accounts",
  urlImage:
    "https://defai.s3.ap-southeast-1.amazonaws.com/elander_eligible_2.png",
};

export const META_DATA_REF_CODE = {
  title: "EDAS Points - Earn points and secure your PERKS",
  description:
    "Earn EDAS Points by supplying to Agents and unlock airdrop eligibility. Stay engaged to maximize your rewards with our incentive model",
  urlImage:
    "https://defai.s3.ap-southeast-1.amazonaws.com/edas_point_metadata.png",
};

// Key chain token
export const KEY_SUI_TOKEN = "sui-token";
export const KEY_SOON_TOKEN = "soon-token";
export const KEY_SOLANA_TOKEN = "solana-token";
export const KEY_ECLIPSE_TOKEN = "eclipse-token";
export const KEY_SUI_MOVEMENT_TOKEN = "sui-movement-token";
export const KEY_APTOS_MOVEMENT_TOKEN = "aptos-movement-token";
export const KEY_TELEGRAM_TOKEN = "telegram-access-token";

// Key wallet address
export const KEY_SOL_WALLET_ADDRESS = "sol_wallet_address";
export const KEY_SUI_WALLET_ADDRESS = "sui_wallet_address";
export const KEY_ECLIPSE_WALLET_ADDRESS = "eclipse_wallet_address";
export const KEY_SOON_WALLET_ADDRESS = "soon_wallet_address";
export const KEY_MOVEMENT_WALLET_ADDRESS = "movement_wallet_address";

// Key wallet address
export const KEY_SOL_WALLET_APP = "sol_wallet_app";
export const KEY_SUI_WALLET_APP = "sui_wallet_app";
export const KEY_ECLIPSE_WALLET_APP = "eclipse_wallet_app";
export const KEY_SOON_WALLET_APP = "soon_wallet_app";
export const KEY_MOVEMENT_WALLET_APP = "movement_wallet_app";

export const KEY_STEP_STATUS_STARTED_ACCOUNT = "step-status-started-account";

export const ActiveNetwork = {
  SUI: false,
  SOLANA: true,
  MOVEMENT: false,
  ECLIPSE: true,
  SOON: false,
};

export const APTOS_MOVEMENT_NETWORK_CONFIG =
  process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
    ? Network.MAINNET
    : process.env.NETWORK_MODE === NetworkModeEnum.TEST_NET
    ? Network.TESTNET
    : Network.DEVNET;

export const USER_REJECTED_MESSAGE = "User Rejected";

export const MINIMUM_STAKE = 100000;
export const EDAS_DECIMAL = 6;
export const ESTIMATED_GAS_FEE_ECLIPSE = 0.0002;
export const ESTIMATED_GAS_FEE_SOL = 0.002;
export const RESERVE_GAS_FEE_ECLIPSE = 0.002;
export const RESERVE_GAS_FEE_SOL = 0.04;
export const MINIMUM_SUPPLY_ECLIPSE = 0.01;
export const MINIUM_SUPPLY_SOL = 0.3;
export const ESTIMATED_TRANSFER_FEE_ECLIPSE = 0.0000001;
export const ESTIMATED_TRANSFER_FEE_SOL = 0.00155;
export const TURBO_TAP_SUPPLY = 1000;

export const TOP_POINT_GTD = 100;
export const TOP_POINT_FCFS = 1000;
export const MINIMUM_STAKE_ON_TOP_GTD = 500000;

export const MESSAGE_VIEW_PORTFOLIO_CHAT = "Show my portfolio";

export enum SUGGESTION_ACTION_TYPE {
  ROADMAP = "ROADMAP",
  REVENUE = "REVENUE",
  STRATEGY = "STRATEGY",
  SUPPLY_AGENT = "SUPPLY_AGENT",
  REDEEM_AGENT = "REDEEM_AGENT",
  LP_KNOWLEDGE = "LP_KNOWLEDGE",
  CHECK_PORTFOLIO = "CHECK_PORTFOLIO",
  SUPPLY_AGENT_PERCENTAGE = "SUPPLY_AGENT_PERCENTAGE",
  SUPPLY_AGENT_CONFIRM = "SUPPLY_AGENT_CONFIRM",
  SUPPLY_AGENT_ACCEPT = "SUPPLY_AGENT_ACCEPT",
  DEPOSIT_AGENT = "DEPOSIT_AGENT",
  REDEEM_AGENT_CONFIRM = "REDEEM_AGENT_CONFIRM",
  REDEEM_AGENT_ACCEPT = "REDEEM_AGENT_ACCEPT",
}

export enum ACTION_STATUS {
  DEPOSIT_SUCCESS = "DEPOSIT_SUCCESS",
  SUPPLY_SUCCESS = "SUPPLY_SUCCESS",
  REDEEM_SUCCESS = "REDEEM_SUCCESS",
}

export const TEXT_SHARE_NFT_CHECKED = `WL Secured! 🚀\n\nI've officially made it into @elander_nft - A limited-edition NFT drop on Eclipse.\n\nCheck your eligibility: __link_check__`;
export const TEXT_SHARE_REFERRAL = `DeFAI is the New DeFi 🚀\n\nDeFi can be complicated, but @EDAS_official makes it easy for everyone. \n\nSupply to Agents, grow your funds, and earn EDAS Points, unlocking exclusive perks!\n\nTry now __link_ref__`;

export const RANK_COUNT_REWARD = 100;

export const MAX_BOOST_POINT = 1.2;
export const KEY_REF_CODE = "ref-code";

export const ACT_ELIGIBLE_CHECKER = "eligible-checker";

export const MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";

export const MINTING_ON_SCOPE_TIME = 1743735600;
