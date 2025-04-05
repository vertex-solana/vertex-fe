import { toLower } from "lodash";
import { AppConstant } from "@/const";
import { BlockChainUtils } from "@/utils";
import { web3 } from "@project-serum/anchor";
import { retry } from "@/utils/common.utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, VersionedTransaction } from "@solana/web3.js";

const useSolanaTransaction = () => {
  const { signTransaction, connected } = useWallet();

  const handleSendSolanaTransaction = async (
    transactionData: any,
    rpcUrl?: string
  ) => {
    try {
      if (!connected || !transactionData || !signTransaction)
        return {} as ResSendSuiTransactionInterface;

      const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint(rpcUrl);

      const connection = new web3.Connection(rpcEndpoint, "confirmed");

      const simulationResult = await simulateAndValidate(
        connection,
        transactionData
      );

      if (simulationResult?.messageError) {
        return {
          txHash: "",
          messageError: simulationResult.messageError,
        };
      }

      const signedTransaction = await signTransaction(transactionData);

      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
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
      } as ResSendSuiTransactionInterface;
    }
  };

  return {
    handleSendSolanaTransaction,
  };
};

export default useSolanaTransaction;

export type SuiGetObjectParamsType = {
  objectId: string;
};

export type SuiGetDynamicFieldObjectType = {
  parentId: string;
  name: {
    type: string;
    value: any;
  };
};

export interface ResSendSuiTransactionInterface {
  txHash: string;
  messageError: string;
}

const MESSAGE_USER_REJECTED_SUI_ERROR = ["Rejected from user"];

export const simulateAndValidate = async (
  connection: Connection,
  transactionData: web3.Transaction | VersionedTransaction
): Promise<{ txHash: string; messageError: string } | undefined> => {
  return retry(() => simulateTransaction(connection, transactionData), 1000, 3);
};

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

export const handleGetErrorMessage = (logs: string[]) => {
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
