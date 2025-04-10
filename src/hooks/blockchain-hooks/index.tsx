import { useState } from "react";
import { AppConstant } from "@/const";
import { web3 } from "@project-serum/anchor";
import { BlockchainTransactionStatusEnum } from "@/models";
import { BlockchainService } from "@/services";

import useSolanaTransaction from "./useSolanaTransaction";

const useTransaction = () => {
  const { handleSendSolanaTransaction } = useSolanaTransaction();

  const [transactionHash, setTransactionHash] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const [transactionStatus, setTransactionStatus] = useState<
    BlockchainTransactionStatusEnum | undefined
  >(undefined);

  const handleSendTransaction = async (
    data: web3.Transaction | web3.Transaction[] | any // NOTE: Update additional type when implement new chain
  ) => {
    try {
      let resTransaction = { txHash: "", messageError: "" };

      resTransaction = await handleSendSolanaTransaction(data);

      if (resTransaction.messageError) {
        if (
          !resTransaction.messageError
            .toLowerCase()
            .includes(AppConstant.USER_REJECTED_MESSAGE.toLowerCase())
        ) {
          setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
          setTransactionError(resTransaction.messageError);
        } else {
          setTransactionStatus(undefined);
        }
      }

      setTransactionHash(resTransaction.txHash);

      return resTransaction.txHash;
    } catch (error: any) {
      console.log(error);
      setTransactionHash("");
      setTransactionError(error.message);
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
    }
  };

  const handleGetTransactionResult = async (
    txHash: string,
    rpcUrl?: string
  ) => {
    try {
      let txStatus = BlockchainTransactionStatusEnum.LOADING;

      txStatus =
        (await BlockchainService.getBlockchainServiceByChain()?.getTransactionResult(
          {
            txHash,
            rpcEndpoint: rpcUrl,
          }
        )) as BlockchainTransactionStatusEnum;

      setTransactionStatus(txStatus);
      return txStatus as BlockchainTransactionStatusEnum;
    } catch (error) {
      console.log(error);
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      setTransactionError(error ? error.toString() : "Something went wrong");
      return BlockchainTransactionStatusEnum.FAILED;
    }
  };

  const handleReset = () => {
    setTransactionHash("");
    setTransactionError("");
    setTransactionStatus(undefined);
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    setTransactionError,
    setTransactionStatus,
    handleSendTransaction,
    handleGetTransactionResult,
  };
};

export default useTransaction;
