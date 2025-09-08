import { CreateWithdrawTransactionParams } from "@/services/billing-service/create-withdraw-transaction";
import { getBillingService } from "@/services/billing-service";
import { BlockchainTransactionStatusEnum } from "@/models";
import useTransaction from "../blockchain-hooks";

const useWithdrawHooks = () => {
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

  const handleWithdraw = async (params: CreateWithdrawTransactionParams) => {
    const withdrawTx = await getBillingService().createWithdrawTransaction(
      params
    );
    if (!withdrawTx) {
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      return "";
    }

    const txHash = await handleSendTransaction(withdrawTx);
    return txHash;
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,
    setTransactionStatus,
    setTransactionHash,
    handleReset,
    handleWithdraw,
    handleGetTransactionResult,
  };
};

export default useWithdrawHooks;
