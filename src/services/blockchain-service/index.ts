import { web3 } from "@project-serum/anchor";
import { BlockchainTransactionStatusEnum } from "@/models";
import { PriorityLevel } from "./sol-blockchain-service/type";
import { TransactionWithSigners } from "@/models/common.model";
import { SolBlockchainService } from "./sol-blockchain-service";

export interface BlockchainServiceInterface {
  getRpcEndpoint(): string;
  getTransactionResult(
    getTransactionResultData: ReqGetTransactionResultInterface
  ): Promise<BlockchainTransactionStatusEnum>;
}

export const getBlockchainServiceByChain = () => {
  return new SolBlockchainService();
};

export interface ResSendTransactionInterface {
  txHash: string;
  messageError: string;
}

export interface ReqSendTransactionInterface {
  transactionData:
    | web3.Transaction
    | web3.Transaction[]
    | TransactionWithSigners
    | TransactionWithSigners[];
  rpcEndpoint?: string;
  walletAddress?: string;
  getLabel?: any;
  priorityLevel?: PriorityLevel;
}

export interface ReqGetTransactionResultInterface {
  txHash: string;
  rpcEndpoint?: string | web3.Cluster;
}
