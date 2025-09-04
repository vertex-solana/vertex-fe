import {
  createInitUserVaultTransaction,
  CreateInitUserVaultTransactionParams,
} from "./create-init-user-vault-transaction";
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
}

export const getBillingService = () => new BillingService();
