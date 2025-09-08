import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { ResTransactionType } from "./interface";
import { BlockChainUtils } from "@/utils";
import { getProgram, seeds, withdrawIndexerFeeIx } from "./sdk";
import * as anchor from "@coral-xyz/anchor";

export interface CreateWithdrawTransactionParams {
  walletAddress: string;
  indexerId: number;
  amount: number;
}

export const createWithdrawTransaction = async (
  params: CreateWithdrawTransactionParams
): Promise<ResTransactionType> => {
  const { amount, indexerId, walletAddress } = params;

  if (!walletAddress) throw new Error("Wallet address is required");
  if (amount <= 0) throw new Error("Amount must be greater than 0");
  if (indexerId <= 0) throw new Error("Indexer ID must be greater than 0");

  const walletPubkey = new PublicKey(walletAddress);
  const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint();
  const connection = new Connection(rpcEndpoint);
  const program = getProgram(connection);

  const indexer = PublicKey.findProgramAddressSync(
    seeds.indexer(walletPubkey, indexerId),
    program.programId
  )[0];

  const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

  const tx = new Transaction();
  const ix = await withdrawIndexerFeeIx(connection, {
    accounts: {
      owner: walletPubkey,
      indexer,
    },
    params: {
      indexerId: new anchor.BN(indexerId),
      amount: new anchor.BN(lamports),
    },
  });
  tx.add(ix);

  return tx;
};
