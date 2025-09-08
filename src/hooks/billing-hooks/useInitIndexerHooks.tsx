import { CreateInitUserVaultTransactionParams } from "@/services/billing-service/create-init-user-vault-transaction";
import { getBillingService } from "@/services/billing-service";
import { BlockchainTransactionStatusEnum } from "@/models";
import useTransaction from "../blockchain-hooks";
import { CreateInitIndexerTransactionParams } from "@/services/billing-service/create-init-indexer-transaction";

const useInitIndexerHooks = () => {
  const {
    setTransactionStatus,
    setTransactionHash,

    handleSendTransaction,
    transactionHash,
    transactionError,
    transactionStatus,
    handleReset,
  } = useTransaction();

  const handleInitIndexer = async (
    params: CreateInitIndexerTransactionParams
  ) => {
    const initTx = await getBillingService().createInitIndexerTransaction(
      params
    );
    if (!initTx) {
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      return null;
    }

    const txHash = await handleSendTransaction(initTx);
    if (!txHash) {
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      return null;
    }

    return txHash;
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,
    setTransactionStatus,
    setTransactionHash,

    handleReset,
    handleInitIndexer,
  };
};

export default useInitIndexerHooks;
