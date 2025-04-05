import { HomeService } from "@/services";
import { BlockChainUtils } from "@/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { SupportedChainEnum, TxAirDropResponseInterface } from "@/models";

import * as web3 from "@solana/web3.js";

const useClaimHook = () => {
  const { signTransaction, signAllTransactions } = useWallet();

  const handleGetTxClaimAirdrop = async (
    airdropId: number,
    walletAddress: string,
    network: SupportedChainEnum
  ) => {
    const res = await HomeService.getTxClaimAirdropService(
      airdropId,
      walletAddress,
      network
    );

    return (res || {}) as TxAirDropResponseInterface;
  };

  const handleSendEncodedTransaction = async (
    solAddress: string,
    transaction: string
  ) => {
    if (!signTransaction || !solAddress || !signAllTransactions) {
      return { txHash: "", messageError: "Please connect wallet address" };
    }

    try {
      const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint();
      const connection = new web3.Connection(rpcEndpoint, "confirmed");

      const deserializedTx = web3.VersionedTransaction.deserialize(
        Uint8Array.from(Buffer.from(transaction, "base64"))
      );

      const signatures = await signTransaction(deserializedTx);

      deserializedTx.addSignature(
        new web3.PublicKey(solAddress),
        signatures.signatures[1]
      );

      const simulate = await connection.simulateTransaction(deserializedTx);
      console.log("simulate", simulate);

      const rawTransaction = deserializedTx.serialize();

      const sig = await connection.sendRawTransaction(rawTransaction);

      if (!sig) {
        return {
          txHash: "",
          messageError: "Oops! Something went wrong.",
        };
      } else {
        return {
          txHash: sig,
          messageError: "",
        };
      }
    } catch (error: any) {
      console.log(error);
      return {
        txHash: "",
        messageError: error.message,
      };
    }
  };

  return {
    handleGetTxClaimAirdrop,
    handleSendEncodedTransaction,
  };
};

export default useClaimHook;
