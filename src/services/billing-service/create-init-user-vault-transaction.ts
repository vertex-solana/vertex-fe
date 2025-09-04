import { SolanaWalletsEnum } from "@/models";
import { BlockChainUtils, CommonUtils } from "@/utils";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { isNil } from "lodash";
import { getProgram, initUserVaultIx, seeds } from "./sdk";

export interface CreateInitUserVaultTransactionParams {
  walletAddress: PublicKey;
}

export const createInitUserVaultTransaction = async (
  params: CreateInitUserVaultTransactionParams
): Promise<Transaction> => {
  const { walletAddress } = params;

  if (!walletAddress) throw new Error("Wallet address is required");

  const rpcEndpoint = BlockChainUtils.getSolanaRpcEndpoint();
  const connection = new Connection(rpcEndpoint);

  const currentWalletProvider = CommonUtils.getProvider()
    .provider as SolanaWalletsEnum;
  const provider = BlockChainUtils.getSolanaWalletsProvider(
    currentWalletProvider
  );

  if (isNil(provider)) {
    throw new Error("Wallet provider is required");
  }

  if (isNil(provider.publicKey)) {
    await provider.connect();
  }

  const program = getProgram(connection);
  const tx = new Transaction();
  const userVault = PublicKey.findProgramAddressSync(
    seeds.userVault(provider.publicKey!),
    program.programId
  )[0];
  const ix = await initUserVaultIx(connection, {
    accounts: {
      owner: provider.publicKey!,
      userVault,
      systemProgram: SystemProgram.programId,
    },
    params: {},
  });

  tx.add(ix);
  return tx;
};
