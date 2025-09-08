import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { ResTransactionType } from "./interface";
import { BlockChainUtils } from "@/utils";
import { depositIx, getProgram, seeds, initUserVaultIx } from "./sdk";
import * as anchor from "@coral-xyz/anchor";

export interface CreateDepositTransactionParams {
  walletAddress: string;
  amount: number;
}

export const createDepositTransaction = async (
  params: CreateDepositTransactionParams
): Promise<ResTransactionType> => {
  const { amount, walletAddress } = params;

  if (!walletAddress) throw new Error("Wallet address is required");
  if (amount <= 0) throw new Error("Amount must be greater than 0");

  try {
    const walletPubkey = new PublicKey(walletAddress);
    const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint();
    const connection = new Connection(rpcEndpoint);
    const program = getProgram(connection);

    const userVault = PublicKey.findProgramAddressSync(
      seeds.userVault(walletPubkey),
      program.programId
    )[0];

    const userVaultAccountInfo = await connection.getAccountInfo(userVault);
    console.log("User vault exists:", !!userVaultAccountInfo);

    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

    const tx = new Transaction();

    if (!userVaultAccountInfo) {
      const initIx = await initUserVaultIx(connection, {
        accounts: {
          owner: walletPubkey,
          userVault: userVault,
          systemProgram: SystemProgram.programId,
        },
        params: {},
      });
      tx.add(initIx);
    }

    const depositInstruction = await depositIx(connection, {
      accounts: {
        payer: walletPubkey,
        userVault: userVault,
      },
      params: {
        amount: new anchor.BN(lamports),
      },
    });
    tx.add(depositInstruction);

    return tx;
  } catch (error) {
    console.error("Error in createDepositTransaction:", error);
    throw error;
  }
};
