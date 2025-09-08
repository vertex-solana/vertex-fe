import { BlockChainUtils } from "@/utils";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { getProgram, initIndexerIx, seeds } from "./sdk";
import { BN } from "bn.js";

export interface CreateInitIndexerTransactionParams {
  walletAddress: string;
  indexerId: number;
}

export const createInitIndexerTransaction = async (
  params: CreateInitIndexerTransactionParams
): Promise<Transaction> => {
  const { walletAddress, indexerId } = params;

  if (!walletAddress) throw new Error("Wallet address is required");

  const walletPubkey = new PublicKey(walletAddress);
  const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint();
  const connection = new Connection(rpcEndpoint);

  const program = getProgram(connection);
  const tx = new Transaction();
  const indexer = PublicKey.findProgramAddressSync(
    seeds.indexer(walletPubkey, indexerId),
    program.programId
  )[0];
  const ix = await initIndexerIx(connection, {
    accounts: {
      owner: walletPubkey,
      indexer,
    },
    params: {
      indexerId: new BN(indexerId),
      pricePerGbLamports: new BN(0), // TODO: update new UI for setting price per GB for read data
    },
  });

  tx.add(ix);
  return tx;
};
