import { BlockChainUtils } from "@/utils";

export const getEdasBalance = async (walletAddress: string) => {
  const edasTokenAddress = process.env.EDAS_TOKEN_ADDRESS || "";

  if (!walletAddress || !edasTokenAddress) return 0;

  const rpcUrl = BlockChainUtils.getSolanaRpcEndpoint();

  const balance = BlockChainUtils.getSvmSplTokenBalance(
    walletAddress,
    edasTokenAddress,
    rpcUrl
  );

  return balance;
};
