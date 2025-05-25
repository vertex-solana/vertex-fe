import {
  LoginWalletDataInterface,
  SolanaWalletsEnum,
} from "@/models/app.model";
import { getNonceService, postLoginService } from "@/services/app-service";
import { CommonUtils } from "@/utils";
import useSolanaAuthHooks from "./solana-auth-hooks";
import Cookies from "js-cookie";

const useAuthHook = () => {
  const { handleSignMessage, handleDisconnectSol } = useSolanaAuthHooks();

  const handleLogout = async () => {
    const { accessToken, keyToken } = CommonUtils.getAccessToken();
    const { keyAddress, storageWalletAddress } =
      CommonUtils.getStorageAddress();

    if (accessToken) {
      Cookies.remove(keyToken);
    }

    if (storageWalletAddress) {
      localStorage.removeItem(keyAddress);
    }

    handleDisconnectSol();
  };

  const handleLoginWallet = async (input: LoginWalletDataInterface) => {
    const { walletAddress, walletType } = input;

    const { accessToken, keyToken } = CommonUtils.getAccessToken();

    if (accessToken) return walletAddress;

    const nonce = await handleGetWalletNonce(walletAddress);

    const selectedWallet = walletType as SolanaWalletsEnum;
    const signature = await handleSignMessage(nonce, selectedWallet);

    if (!signature) {
      handleLogout();
      return "";
    }

    const newAccessToken = await handleGetAccessToken(walletAddress, signature);

    if (newAccessToken) {
      Cookies.set(keyToken, newAccessToken);
      localStorage.setItem("sol_wallet_address", walletAddress);
      return walletAddress;
    } else {
      handleLogout();
      return "";
    }
  };

  const handleGetWalletNonce = async (walletAddress: string) => {
    if (!walletAddress) return "";

    const responseData = await getNonceService(walletAddress);

    return responseData?.nonce || "";
  };

  const handleGetAccessToken = async (
    walletAddress: string,
    signature: string,
  ) => {
    if (!walletAddress || !signature) return "";

    const { accessToken } = await postLoginService(walletAddress, signature);

    return accessToken;
  };

  return {
    handleLoginWallet,
    handleLogout,
  };
};

export default useAuthHook;
