import { Transaction } from "@solana/web3.js";
import { CreateInitUserVaultTransactionParams } from "./create-init-user-vault-transaction";
import { CreateInitIndexerTransactionParams } from "./create-init-indexer-transaction";
import { CreateDepositTransactionParams } from "./create-deposit-transaction";
import { CreateWithdrawTransactionParams } from "./create-withdraw-transaction";
import { GetVaultBalanceParams, VaultBalanceResponse } from "./get-vault-balance";

export interface BillingServiceInterface {
  createInitUserVaultTransaction(
    params: CreateInitUserVaultTransactionParams
  ): Promise<ResTransactionType>;

  createInitIndexerTransaction(
    params: CreateInitIndexerTransactionParams
  ): Promise<ResTransactionType>;

  createDepositTransaction(
    params: CreateDepositTransactionParams
  ): Promise<ResTransactionType>;

  createWithdrawTransaction(
    params: CreateWithdrawTransactionParams
  ): Promise<ResTransactionType>;

  getUserVaultBalance(
    params: GetVaultBalanceParams
  ): Promise<VaultBalanceResponse>;

  getIndexerVaultBalance(
    params: GetVaultBalanceParams
  ): Promise<VaultBalanceResponse>;
}

export type ResTransactionType = Transaction;
