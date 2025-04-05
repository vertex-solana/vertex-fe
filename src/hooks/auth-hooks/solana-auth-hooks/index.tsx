import { useWallet, Wallet } from "@solana/wallet-adapter-react";

const useSolanaAuthHooks = () => {
  const { disconnect } = useWallet();

  const handleGetSolanaAddress = async (wallet: Wallet) => {
    try {
      const account = await wallet?.adapter.publicKey;

      return account?.toString() || "";
    } catch (error) {
      console.error("Error getting solana address:", error);
      return "";
    }
  };

  const handleDisconnectSol = async () => {
    disconnect();
  };

  return {
    handleDisconnectSol,
    handleGetSolanaAddress,
  };
};

export default useSolanaAuthHooks;
