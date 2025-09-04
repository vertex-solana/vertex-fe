import { Transaction } from "@solana/web3.js";
import { CreateInitUserVaultTransactionParams } from "./create-init-user-vault-transaction";
import { CreateInitIndexerTransactionParams } from "./create-init-indexer-transaction";

export interface BillingServiceInterface {
  createInitUserVaultTransaction(
    params: CreateInitUserVaultTransactionParams
  ): Promise<ResTransactionType>;

  createInitIndexerTransaction(
    params: CreateInitIndexerTransactionParams
  ): Promise<ResTransactionType>;
}

export type ResTransactionType = Transaction;
