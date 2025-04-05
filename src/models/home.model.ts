import { AgentName } from "./app.model";

export enum AirdropStatusEnum {
  START = "START",
  FINISHED = "FINISHED",
  CLAIMING = "CLAIMING",
  CLAIMED = "CLAIMED",
}
export interface EdasAirdropInterface {
  startDate: string;
  endDate: string;
  totalAmount: number;
}

export interface AirdropEligibleInterface {
  walletAddress: string;
  isEligible: boolean;
  questUrl: string;
}

export interface AirdropStatusInterface {
  walletAddress: string;
  status: AirdropStatusEnum;
}

export interface TxAirDropResponseInterface {
  walletAddress: string;
  transaction: string;
}

export interface AgentsResponseInterface {
  id: string;
  name: AgentName;
  clients: any[];
}

export interface AgentsMessageResponseInterface {
  action: string;
  text: string;
  user: string;
  pools_info?: PoolInfoResponseInterface[];
  suggestions?: SuggestionsResponseInterface[];
  positions?: PositionResponseInterface[];
  actionStatus?: string;
}

export interface AgentsMessageSocketInterface {
  agentType: AgentName;
  agentId: string;
  response: AgentsMessageResponseInterface[];
}

export interface PoolInfoResponseInterface {
  id: string;
  pool_name: string;
  mintA: string;
  mintB: string;
  price: string;
  tvl: string;
  day_apr: string;
  platform: PlatformNameEnum;
  risk: string;
}

export interface PositionResponseInterface {
  id: string;
  pool_name: string;
  mintA: string;
  mintB: string;
  mintA_amount: number;
  mintB_amount: number;
  total_deposited: number;
  platform: PlatformNameEnum;
}

export interface SuggestionsResponseInterface {
  title: string;
  content: string;
  action: string;
  [key: string]: any;
}

export enum PlatformNameEnum {
  ORCA = "orca",
  RAYDIUM = "raydium",
  METEORA = "meteora",
  BLUEFIN = "bluefin",
}
