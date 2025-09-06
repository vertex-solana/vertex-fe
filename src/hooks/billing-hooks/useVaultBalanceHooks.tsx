import { useState } from "react";
import { getBillingService } from "@/services/billing-service";

const useVaultBalanceHooks = () => {
  const [userVaultBalance, setUserVaultBalance] = useState<number>(0);
  const [indexerVaultBalance, setIndexerVaultBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const getUserVaultBalance = async (vaultAddress: string) => {
    if (!vaultAddress) {
      setUserVaultBalance(0);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getBillingService().getUserVaultBalance({
        vaultAddress,
      });
      setUserVaultBalance(response.balance);
    } catch (error) {
      console.error("Error fetching user vault balance:", error);
      setUserVaultBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  const getIndexerVaultBalance = async (vaultAddress: string) => {
    if (!vaultAddress) {
      setIndexerVaultBalance(0);
      return;
    }

    try {
      setIsLoading(true);
      const response = await getBillingService().getIndexerVaultBalance({
        vaultAddress,
      });
      setIndexerVaultBalance(response.balance);
    } catch (error) {
      console.error("Error fetching indexer vault balance:", error);
      setIndexerVaultBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userVaultBalance,
    indexerVaultBalance,
    isLoading,
    getUserVaultBalance,
    getIndexerVaultBalance,
  };
};

export default useVaultBalanceHooks;
