import { Idl } from "@coral-xyz/anchor";
import { Idl as IdlV30 } from "anchor-v30";

export interface UserInfoInterface {
  id: number;
  email: string;
  userName: string;
  walletAddress: string;
  isUpdatedUserName: boolean;
  createdAt: Date;
}

export enum SolanaWalletsEnum {
  Backpack = "Backpack",
  Phantom = "Phantom",
  Solflare = "Solflare",
}

export interface GetNonceResponse {
  walletAddress: string;
  nonce: string;
}

export interface PostLoginResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface IndexerResponse {
  id: number;
  name: string;
  description: string;
  programId: string;
  slug: string;
  cluster: string;
  ownerAccountId: number;
  owner: UserInfoInterface;
}

export enum TriggerType {
  WS = "WS",
}

interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
}

export interface IndexerTableMetadata {
  id: number;
  tableName: string;
  fullTableName: string;
  schema: SchemaField[];
  indexerId: number;
}

export interface ExecuteQueryResponse {
  query: string;
  schema: { [key: string]: any };
  rows: { [key: string]: any }[];
}

export interface TransformerPda {
  id: number;
  script: string;
  indexerId: number;
}

export interface TriggerAndTransformer {
  triggerType: string;
  pdaPubkey: string;
  pdaName: string;
  transformerPdaId: number;
  transformerPda: TransformerPda;
  indexerTableId: number;
  indexerId: number;
}

export interface IdlDappResponse {
  id: number;
  name: string;
  version: string;
  idlJson: Idl | IdlV30;
  programId: string;
}

export interface QueryLogResponse {
  id: number;
  description: string;
  query: string;
  indexerId: number;
}

export enum IndexerTypeEnum {
  All = "All",
  Owner = "Owner",
}

export interface LoginWalletDataInterface {
  walletAddress: string;
  walletType: SolanaWalletsEnum
}