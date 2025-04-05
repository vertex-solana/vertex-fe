import { CommonUtils } from "@/utils";
import { SupportedChainEnum } from "@/models";

const useAuthHook = () => {
  const handleLogout = async (selectedChain: SupportedChainEnum) => {
    const { keyAddress } = CommonUtils.getStorageAddressByChain(selectedChain);
    const { keyWalletApp } =
      CommonUtils.getStorageWalletAppByChain(selectedChain);

    if (keyAddress) {
      localStorage.removeItem(keyAddress);
    }
    if (keyWalletApp) {
      localStorage.removeItem(keyWalletApp);
    }
  };

  return {
    handleLogout,
  };
};

export default useAuthHook;
