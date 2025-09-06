import {
  createInitIndexerTransaction,
  CreateInitIndexerTransactionParams,
} from "./create-init-indexer-transaction";
import {
  createInitUserVaultTransaction,
  CreateInitUserVaultTransactionParams,
} from "./create-init-user-vault-transaction";
import {
  createDepositTransaction,
  CreateDepositTransactionParams,
} from "./create-deposit-transaction";
import {
  createWithdrawTransaction,
  CreateWithdrawTransactionParams,
} from "./create-withdraw-transaction";
import {
  getUserVaultBalance,
  getIndexerVaultBalance,
  GetVaultBalanceParams,
  VaultBalanceResponse,
} from "./get-vault-balance";
import { BillingServiceInterface, ResTransactionType } from "./interface";

export class BillingService implements BillingServiceInterface {
  private async createTransaction<T>(
    createTransactionFn: (data: T) => Promise<ResTransactionType>,
    data: T
  ): Promise<ResTransactionType> {
    return await createTransactionFn(data);
  }

  createInitUserVaultTransaction(
    params: CreateInitUserVaultTransactionParams
  ): Promise<ResTransactionType> {
    return this.createTransaction(createInitUserVaultTransaction, params);
  }

  createInitIndexerTransaction(
    params: CreateInitIndexerTransactionParams
  ): Promise<ResTransactionType> {
    return this.createTransaction(createInitIndexerTransaction, params);
  }

  createDepositTransaction(
    params: CreateDepositTransactionParams
  ): Promise<ResTransactionType> {
    return this.createTransaction(createDepositTransaction, params);
  }

  createWithdrawTransaction(
    params: CreateWithdrawTransactionParams
  ): Promise<ResTransactionType> {
    return this.createTransaction(createWithdrawTransaction, params);
  }

  getUserVaultBalance(
    params: GetVaultBalanceParams
  ): Promise<VaultBalanceResponse> {
    return getUserVaultBalance(params);
  }

  getIndexerVaultBalance(
    params: GetVaultBalanceParams
  ): Promise<VaultBalanceResponse> {
    return getIndexerVaultBalance(params);
  }
}

export const getBillingService = () => new BillingService();
