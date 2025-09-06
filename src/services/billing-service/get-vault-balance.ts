import { VaultType } from "@/models/app.model";
import { BlockChainUtils } from "@/utils";
import { Connection, PublicKey } from "@solana/web3.js";
import { getProgram, Indexer, UserVault } from "./sdk";

export interface GetVaultBalanceParams {
  vaultAddress: string;
}

export interface VaultBalanceResponse {
  balance: number;
  vaultType: VaultType;
}

export const getUserVaultBalance = async (
  params: GetVaultBalanceParams
): Promise<VaultBalanceResponse> => {
  const connection = new Connection(BlockChainUtils.getSolanaRpcEndpoint());
  const program = getProgram(connection);

  const userVault = new UserVault(new PublicKey(params.vaultAddress));
  const balance = await userVault.getTotalSol(program);

  return {
    balance,
    vaultType: VaultType.USER,
  };
};

export const getIndexerVaultBalance = async (
  params: GetVaultBalanceParams
): Promise<VaultBalanceResponse> => {
  const connection = new Connection(BlockChainUtils.getSolanaRpcEndpoint());
  const program = getProgram(connection);

  const indexer = new Indexer(new PublicKey(params.vaultAddress));
  const balance = await indexer.getTotalSol(program);

  return {
    balance,
    vaultType: VaultType.INDEXER,
  };
};
