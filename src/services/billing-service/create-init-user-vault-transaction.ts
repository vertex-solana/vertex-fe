import { BlockChainUtils } from "@/utils";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { getProgram, initUserVaultIx, seeds } from "./sdk";

export interface CreateInitUserVaultTransactionParams {
  walletAddress: PublicKey;
}

export const createInitUserVaultTransaction = async (
  params: CreateInitUserVaultTransactionParams
): Promise<Transaction> => {
  const { walletAddress } = params;

  if (!walletAddress) throw new Error("Wallet address is required");

  const walletPubkey = new PublicKey(walletAddress);
  const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint();
  const connection = new Connection(rpcEndpoint);

  const program = getProgram(connection);
  const tx = new Transaction();
  const userVault = PublicKey.findProgramAddressSync(
    seeds.userVault(walletPubkey),
    program.programId
  )[0];
  const ix = await initUserVaultIx(connection, {
    accounts: {
      owner: walletPubkey,
      userVault,
      systemProgram: SystemProgram.programId,
    },
    params: {},
  });

  tx.add(ix);
  return tx;
};
