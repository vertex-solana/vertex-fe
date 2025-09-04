import { Transaction } from "@solana/web3.js";
import { CreateInitUserVaultTransactionParams } from "./create-init-user-vault-transaction";

export interface BillingServiceInterface {
  createInitUserVaultTransaction(
    params: CreateInitUserVaultTransactionParams
  ): Promise<ResTransactionType>;
}

export type ResTransactionType = Transaction;
