import {
  BlockchainServiceInterface,
  ReqGetTransactionResultInterface,
} from "..";

import { BlockChainUtils } from "@/utils";
import { BlockchainTransactionStatusEnum } from "@/models";
import { getTransactionResult } from "./get-transaction-result";

export class SolBlockchainService implements BlockchainServiceInterface {
  getRpcEndpoint(rpcUrl?: string): string {
    return BlockChainUtils.getSolanaRpcEndpoint(rpcUrl);
  }

  async getTransactionResult(
    getTransactionResultData: ReqGetTransactionResultInterface
  ): Promise<BlockchainTransactionStatusEnum> {
    const { rpcEndpoint: rpcUrl } = getTransactionResultData;
    const rpcEndpoint = this.getRpcEndpoint(rpcUrl);
    const result = await getTransactionResult({
      ...getTransactionResultData,
      rpcEndpoint,
    });

    return result;
  }
}
