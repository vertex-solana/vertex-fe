import * as web3 from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import { SolanaWalletsEnum, SupportedChainEnum } from "@/models";
import { PublicKey } from "@solana/web3.js";

export const getSolanaWalletsProvider = (solWallet: SolanaWalletsEnum) => {
  if (typeof window === undefined) return undefined;

  switch (solWallet) {
    case SolanaWalletsEnum.Backpack:
      return window.backpack?.solana;

    case SolanaWalletsEnum.Phantom:
      if (!window?.phantom) return undefined;
      return window.phantom.solana;

    case SolanaWalletsEnum.Solflare:
      return window.solflare;

    default:
      return undefined;
  }
};

export const getSVMRpcEndpoint = (chain: SupportedChainEnum) => {
  switch (chain) {
    case SupportedChainEnum.Solana:
      return getSolanaRpcEndpoint();
    case SupportedChainEnum.Eclipse:
      return getEclipseRpcEndpoint();

    default:
      return getSolanaRpcEndpoint();
  }
};

export const getSolanaRpcEndpoint = (rpcUrl?: string): string => {
  if (rpcUrl) return rpcUrl;

  if (process.env.RPC_URL) return process.env.RPC_URL;

  let mode = "devnet";

  if (process.env.NETWORK_MODE === "devnet") {
    mode = "devnet";
  } else if (process.env.NETWORK_MODE === "testnet") {
    mode = "devnet";
  } else {
    mode = "mainnet-beta";
  }

  return web3.clusterApiUrl(mode as web3.Cluster);
};

export const getEclipseRpcEndpoint = (): string => {
  return process.env.ECLIPSE_RPC_URL || "";
};

export const getSolanaNativeTokenBalance = async (
  walletAddress: string,
  rpcUrl: string
) => {
  if (!walletAddress || !rpcUrl) return 0;

  try {
    const connection = new web3.Connection(rpcUrl, "finalized");

    const address = new web3.PublicKey(walletAddress);
    const balance = await connection.getBalance(address);

    return balance / web3.LAMPORTS_PER_SOL;
  } catch (error) {
    return 0;
  }
};

export const getSvmSplTokenBalance = async (
  walletAddress: string,
  tokenContractAddress: string,
  rpcUrl: string
) => {
  if (!walletAddress) return 0;

  try {
    const connection = new web3.Connection(rpcUrl, "finalized");

    const pubKey = new web3.PublicKey(walletAddress);
    const mintPubKey = new web3.PublicKey(tokenContractAddress);

    const tokenAccount = await web3.PublicKey.findProgramAddressSync(
      [
        pubKey.toBuffer(),
        splToken.TOKEN_PROGRAM_ID.toBuffer(),
        mintPubKey.toBuffer(),
      ],
      splToken.ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const tokenAmountInfo = await connection.getTokenAccountBalance(
      tokenAccount[0] || tokenAccount,
      "confirmed"
    );
    const tokenAmount = tokenAmountInfo.value.uiAmount || 0;

    return tokenAmount;
  } catch (error) {
    return 0;
  }
};

export const getSignatureStatus = async (signature: string) => {
  const rpcEndpoint = getSolanaRpcEndpoint();

  const connection = new web3.Connection(rpcEndpoint, "confirmed");

  const status = await connection.getSignatureStatus(signature);

  const statusInfo = status.value;

  const confirmationStatus = statusInfo?.confirmationStatus;

  if (
    confirmationStatus === "finalized" ||
    confirmationStatus === "confirmed"
  ) {
    const isSuccess = status?.value?.err === null;

    if (isSuccess) {
      return statusInfo;
    } else {
      return null;
    }
  }

  throw new Error("Transaction not confirmed");
};

export const validateSolWalletAddress = (address: string): boolean => {
  try {
    const pubkey = new PublicKey(address);
    return PublicKey.isOnCurve(pubkey.toBuffer());
  } catch (error) {
    return false;
  }
};
