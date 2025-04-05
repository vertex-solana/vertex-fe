import { BlockchainService } from "@/services";
import { SupportedChainEnum } from "@/models/app.model";
import { BlockChainUtils } from "@/utils";

const useBalances = () => {
  const handleGetEdasBalance = async (
    chain: SupportedChainEnum,
    walletAddress: string
  ) => {
    try {
      const tokenBalance = await BlockchainService.getBlockchainServiceByChain(
        chain
      )?.getEdasBalance(walletAddress);

      return tokenBalance;
    } catch (error) {
      console.log("error", error);
      return 0;
    }
  };

  const handleGetSvmNativeBalanceToken = async (
    walletAddress: string,
    rpcUrl: string
  ) => {
    if (!walletAddress || !rpcUrl) return 0;

    const balance = await BlockChainUtils.getSolanaNativeTokenBalance(
      walletAddress,
      rpcUrl
    );

    return balance;
  };

  return {
    handleGetEdasBalance,
    handleGetSvmNativeBalanceToken,
  };
};

export default useBalances;
