import { useState } from "react";
import { AppConstant } from "@/const";
import { web3 } from "@project-serum/anchor";
import { BlockchainTransactionStatusEnum } from "@/models";
import { BlockchainService } from "@/services";

import { retry, wait } from "@/utils/common.utils";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  Connection,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import { BlockChainUtils } from "@/utils";
import { toLower } from "lodash";

export interface ResSendTransactionInterface {
  txHash: string;
  messageError: string;
}

const useTransaction = () => {
  const { signTransaction, connected, publicKey } = useWallet();

  const [transactionHash, setTransactionHash] = useState<string>("");
  const [transactionError, setTransactionError] = useState<string>("");
  const [transactionStatus, setTransactionStatus] =
    useState<BlockchainTransactionStatusEnum | null>(null);

  const handleSendTransaction = async (data: web3.Transaction) => {
    try {
      console.log("go in here");
      let resTransaction = { txHash: "", messageError: "" };

      await wait(3000);
      // resTransaction = await handleSendSolanaTransaction(data);
      // @ts-ignore
      resTransaction = {
        txHash: "19042094234093284032",
        // messageError: "",
      };

      if (resTransaction.messageError) {
        if (
          !resTransaction.messageError
            .toLowerCase()
            .includes(AppConstant.USER_REJECTED_MESSAGE.toLowerCase())
        ) {
          setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
          setTransactionError(resTransaction.messageError);
        } else {
          setTransactionStatus(null);
        }
      }

      return resTransaction.txHash;
    } catch (error: any) {
      console.log(error);
      setTransactionHash("");
      setTransactionError(error.message);
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
    }
  };

  const handleSendSolanaTransaction = async (
    transactionData: Transaction,
    rpcUrl?: string
  ) => {
    try {
      if (!connected || !transactionData || !signTransaction || !publicKey)
        return {} as ResSendTransactionInterface;

      const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint(rpcUrl);

      const connection = new web3.Connection(rpcEndpoint, "confirmed");

      const latestBlockhash = await connection.getLatestBlockhash("confirmed");
      const messageV0 = new TransactionMessage({
        instructions: transactionData.instructions,
        payerKey: publicKey,
        recentBlockhash: latestBlockhash.blockhash,
      }).compileToV0Message();
      const versionedTx = new VersionedTransaction(messageV0);

      const simulationResult = await simulateAndValidate(
        connection,
        versionedTx
      );

      if (simulationResult?.messageError) {
        return {
          txHash: "",
          messageError: simulationResult.messageError,
        };
      }

      const signedTx = await signTransaction(versionedTx);

      const signature = await connection.sendRawTransaction(
        signedTx.serialize()
      );

      return {
        txHash: signature,
        messageError: "",
      };
    } catch (error: any) {
      console.log("error", error.message);

      const message = MESSAGE_USER_REJECTED_SUI_ERROR.includes(error.message)
        ? AppConstant.USER_REJECTED_MESSAGE
        : error.message;

      return {
        txHash: "",
        messageError: message,
      } as ResSendTransactionInterface;
    }
  };

  const simulateAndValidate = async (
    connection: Connection,
    transactionData: web3.Transaction | VersionedTransaction
  ): Promise<{ txHash: string; messageError: string } | undefined> => {
    return retry(
      () => simulateTransaction(connection, transactionData),
      1000,
      3
    );
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
    setTransactionStatus(null);
  };

  return {
    transactionHash,
    transactionError,
    transactionStatus,

    handleReset,
    setTransactionError,
    setTransactionStatus,
    setTransactionHash,
    handleSendTransaction,
    handleGetTransactionResult,
  };
};

export default useTransaction;

const MESSAGE_USER_REJECTED_SUI_ERROR = ["Rejected from user"];

const simulateTransaction = async (
  connection: Connection,
  transactionData: web3.Transaction | VersionedTransaction
): Promise<{ txHash: string; messageError: string } | undefined> => {
  let simulateResult;
  if (transactionData instanceof VersionedTransaction) {
    simulateResult = await connection.simulateTransaction(transactionData);
  } else {
    simulateResult = await connection.simulateTransaction(transactionData);
  }

  if (simulateResult?.value?.err) {
    console.log("simulateResult: ", simulateResult);
    const messageError = simulateResult.value.logs
      ? handleGetErrorMessage(simulateResult.value.logs)
      : "";

    if (
      toLower(messageError).includes("require_gte expression was violated") ||
      toLower(messageError).includes("price slippage check")
    ) {
      throw Error(messageError);
    }

    return {
      txHash: "",
      messageError: messageError || "",
    };
  }
  return;
};

const handleGetErrorMessage = (logs: string[]) => {
  const errorMessagePrefix = "Error Message: ";

  for (const log of logs) {
    if (log.includes("insufficient lamports")) {
      return "Insufficient SOL for Gas Fee";
    }

    const startIndex = log.indexOf(errorMessagePrefix);
    if (startIndex !== -1) {
      const endIndex = log.indexOf(".", startIndex);
      return log
        .substring(
          startIndex + errorMessagePrefix.length,
          endIndex === -1 ? log.length : endIndex
        )
        .trim();
    }
  }

  return undefined;
};
