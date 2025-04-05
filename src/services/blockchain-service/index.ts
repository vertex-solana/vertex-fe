import { web3 } from "@project-serum/anchor";
import { SupportedChainEnum } from "@/models/app.model";
import { BlockchainTransactionStatusEnum } from "@/models";
import { PriorityLevel } from "./sol-blockchain-service/type";
import { TransactionWithSigners } from "@/models/common.model";
import { SolBlockchainService } from "./sol-blockchain-service";

export interface BlockchainServiceInterface {
  getRpcEndpoint(): string;
  getTransactionResult(
    getTransactionResultData: ReqGetTransactionResultInterface
  ): Promise<BlockchainTransactionStatusEnum>;
  getEdasBalance?: (walletAddress: string) => Promise<number>;
}

export const getBlockchainServiceByChain = (chain: SupportedChainEnum) => {
  switch (chain) {
    case SupportedChainEnum.Solana:
    case SupportedChainEnum.Eclipse:
      return new SolBlockchainService();

    default:
      return null;
  }
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
  selectedChain?: SupportedChainEnum;
}

export interface ReqGetTransactionResultInterface {
  txHash: string;
  rpcEndpoint?: string | web3.Cluster;
}
