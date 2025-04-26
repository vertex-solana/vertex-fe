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

export interface IndexerResponse {
  id: number;
  name: string;
  description: string;
  programId: string;
  slug: string;
  cluster: string;
  ownerAccountId: number;
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

export interface IdlDapp {
  id: number;
  name: string;
  version: string;
  idlJson: Idl | IdlV30;
  programId: string;
}

export interface RpcResponse {
  id: number;
  url: string;
  cluster: string;
}
