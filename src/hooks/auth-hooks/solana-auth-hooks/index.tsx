import { SolanaWalletsEnum } from "@/models";
import { BlockChainUtils, CommonUtils } from "@/utils";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { isNil } from "lodash";
import bs58 from "bs58";

const useSolanaAuthHooks = () => {
  const { disconnect } = useWallet();

  const handleConnectWallet = async (selectedWallet: SolanaWalletsEnum) => {
    const provider = BlockChainUtils.getSolanaWalletsProvider(selectedWallet);

    if (!provider) return;

    const { keyProvider } = CommonUtils.getProvider();

    localStorage.setItem(keyProvider, selectedWallet);

    try {
      const data = await provider.connect();

      if (!Boolean(data)) return "";

      let address;

      const publicKey = provider?.publicKey;
      if (!publicKey) return;

      address = publicKey.toString();

      return address;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const handleSignMessage = async (
    nonce: string,
    selectedWallet?: SolanaWalletsEnum
  ) => {
    if (isNil(nonce)) return;
    const provider = BlockChainUtils.getSolanaWalletsProvider(selectedWallet);

    try {
      const encodedMessage = new TextEncoder().encode(nonce);
      const signedMessage = await provider.signMessage(encodedMessage);

      const signature = bs58.encode(signedMessage?.signature || "");

      return signature;
    } catch (error) {
      console.log(error);

      return "";
    }
  };

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
    const { keyProvider } = CommonUtils.getProvider()
    localStorage.removeItem(keyProvider);

    disconnect();
  };

  const handleGetSolWalletAddress = async (
    selectedWallet?: SolanaWalletsEnum,
  ) => {
    const currentWalletProvider = CommonUtils.getProvider()
      .provider as SolanaWalletsEnum;

    const provider = (selectedWallet ||
      currentWalletProvider) as SolanaWalletsEnum;

    if (!provider) return;

    const address = await handleConnectWallet(provider);

    if (!address) {
      handleDisconnectSol();
      return '';
    }

    return address;
  };

  return {
    handleGetSolWalletAddress,
    handleConnectWallet,
    handleSignMessage,
    handleDisconnectSol,
    handleGetSolanaAddress,
  };
};

export default useSolanaAuthHooks;
