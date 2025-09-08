import { CreateDepositTransactionParams } from "@/services/billing-service/create-deposit-transaction";
import { getBillingService } from "@/services/billing-service";
import { BlockchainTransactionStatusEnum } from "@/models";
import useTransaction from "../blockchain-hooks";

const useDepositHooks = () => {
  const {
    setTransactionStatus,
    setTransactionHash,
    handleSendTransaction,
    transactionHash,
    transactionError,
    transactionStatus,
    handleReset,
    handleGetTransactionResult,
  } = useTransaction();

  const handleDeposit = async (params: CreateDepositTransactionParams) => {
    const depositTx = await getBillingService().createDepositTransaction(
      params
    );
    if (!depositTx) {
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      return "";
    }

    const txHash = await handleSendTransaction(depositTx);
    return txHash;
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,
    setTransactionStatus,
    setTransactionHash,
    handleReset,
    handleDeposit,
    handleGetTransactionResult,
  };
};

export default useDepositHooks;
