export interface UserInfoInterface {
  userName?: string;
  address?: string;
  email?: string;
}

export interface ObjectMultiLanguageProps {
  [x: string]: string;
}

export enum SupportedChainEnum {
  Sui = "SUI",
  Solana = "SOLANA",
  Movement = "MOVEMENT",
  Eclipse = "ECLIPSE",
  Soon = "SOON",
}

export enum SolanaWalletsEnum {
  Backpack = "Backpack",
  Phantom = "Phantom",
  Solflare = "Solflare",
}

export enum NetworkModeEnum {
  DEV_NET = "devnet",
  TEST_NET = "testnet",
  MAIN_NET = "mainnet",
}

export enum AgentName {
  attack = "attack",
  amored = "amored",
  colossal = "colossal",
}

export interface LeaderBoardInterface {
  id: string;
  name: string;
  symbol: string;
  image: string;
  rank: number;
  market_cap: number;
  portfolio: {
    balance: number;
    token: string;
  };
  change_24h: number;
  users: number;
  aumAmount: number;
  aumValue: number;
}

export interface ExploreInterface {
  id: string;
  name: AgentName;
  symbol: string;
  image: string;
  contract_address: string;
  network: SupportedChainEnum;
  status: ExploreStatusEnum;
  description: string;
  telegram_url: string;
  x_url: string;
  market_cap: number;
  portfolio: {
    balance: number;
    token: string;
  };
}

export enum WhitelistType {
  GTD = "GTD",
  FCFS = "FCFS",
}

export interface ElanderEligibleInterface {
 whitelist: WhitelistType[];
 totalStaked: number;
 rankingEnsoPoint: number | null;
}

export enum ExploreStatusEnum {
  LIVE = "Live",
  PRE_SALE = "Pre-sale",
  COMING = "Coming",
  BETA_LIVE = "Beta Live",
  CHAT_LIVE = "Chat Live",
}

export interface PriceFeedInterface {
  price: number;
  priceFeedId: string;
}

export interface PriceFeedsResponseInterface {
  id: string;
  ema_price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
  price: {
    price: string;
    conf: string;
    expo: number;
    publish_time: number;
  };
}

export interface AssetInterface {
  id: string;
  name: SupportedChainEnum;
  chain: SupportedChainEnum;
  priceFeedAccountAddress: string;
  priceFeedId: string;
  symbol: SupportTokenType;
  tokenAddress: string;
  decimals: number;
  priceFeedProvider: {
    id: string;
    name: string;
    type: string;
    url: string;
  };
  tokenType: TokenTypeEnum | null;
}

export type SupportTokenType =
  | SolanaSupportedTokenEnum
  | EclipseSupportedTokenEnum;

export enum TokenTypeEnum {
  SPL_TOKEN = "spl-token",
  NATIVE_MINT = "native-mint",
  SPL_TOKEN_2022 = "spl-token-2022",
}

export enum SolanaSupportedTokenEnum {
  USDC = "USDC",
  SOL = "SOL",
  BSOL = "BSOL",
  MSOL = "MSOL",
  JITOSOL = "JITOSOL",
  INF = "INF",
  USDT = "USDT",
  AI16Z = "ai16z",
}

export enum EclipseSupportedTokenEnum {
  USDC = "USDC",
  ETH = "ETH",
  SOL = "SOL",
}
