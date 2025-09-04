import { CreateInitUserVaultTransactionParams } from "@/services/billing-service/create-init-user-vault-transaction";
import { getBillingService } from "@/services/billing-service";
import { BlockchainTransactionStatusEnum } from "@/models";
import useTransaction from "../blockchain-hooks";

const useInitUserVaultHooks = () => {
  const {
    setTransactionStatus,
    setTransactionHash,

    handleSendTransaction,
    transactionHash,
    transactionError,
    transactionStatus,
    handleReset,
  } = useTransaction();

  const handleInitUserVault = async (
    params: CreateInitUserVaultTransactionParams
  ) => {
    const initTx = await getBillingService().createInitUserVaultTransaction(
      params
    );
    if (!initTx) {
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      return "";
    }

    const txHash = await handleSendTransaction(initTx);

    return txHash;
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,
    setTransactionStatus,
    setTransactionHash,

    handleReset,
    handleInitUserVault,
  };
};

export default useInitUserVaultHooks;
