import { useState, useCallback } from "react";
import { getBillingService } from "@/services/billing-service";
import useApiManager from "../useApiManager";
import { VaultType } from "@/models/app.model";

const useVaultBalanceHooks = () => {
  const [userVaultBalance, setUserVaultBalance] = useState<number>(0);
  const [indexerVaultBalance, setIndexerVaultBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const { makeRequest, invalidateCache } = useApiManager();

  const getUserVaultBalance = useCallback(
    async (vaultAddress: string) => {
      if (!vaultAddress) {
        setUserVaultBalance(0);
        return;
      }

      try {
        setIsLoading(true);

        const response = await makeRequest(
          `user-vault-balance-${vaultAddress}`,
          () => getBillingService().getUserVaultBalance({ vaultAddress }),
          { ttl: 10000, deduplicate: true } // 10 second cache
        );

        setUserVaultBalance(response.balance);
      } catch (error) {
        console.error("Error fetching user vault balance:", error);
        setUserVaultBalance(0);
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  const getIndexerVaultBalance = useCallback(
    async (vaultAddress: string) => {
      if (!vaultAddress) {
        setIndexerVaultBalance(0);
        return;
      }

      try {
        setIsLoading(true);

        const response = await makeRequest(
          `indexer-vault-balance-${vaultAddress}`,
          () => getBillingService().getIndexerVaultBalance({ vaultAddress }),
          { ttl: 10000, deduplicate: true } // 10 second cache
        );

        setIndexerVaultBalance(response.balance);
      } catch (error) {
        console.error("Error fetching indexer vault balance:", error);
        setIndexerVaultBalance(0);
      } finally {
        setIsLoading(false);
      }
    },
    [makeRequest]
  );

  const refreshVaultBalance = useCallback(
    (vaultType: VaultType, vaultAddress: string) => {
      // Invalidate cache and refresh
      invalidateCache(`${vaultType}-vault-balance-${vaultAddress}`);

      if (vaultType === VaultType.USER) {
        getUserVaultBalance(vaultAddress);
      } else {
        getIndexerVaultBalance(vaultAddress);
      }
    },
    [getUserVaultBalance, getIndexerVaultBalance, invalidateCache]
  );

  const refreshAllVaultBalances = useCallback(() => {
    console.log("🔄 Refreshing all vault balances");
    invalidateCache(); // Clear all cache
  }, [invalidateCache]);

  return {
    userVaultBalance,
    indexerVaultBalance,
    isLoading,
    getUserVaultBalance,
    getIndexerVaultBalance,
    refreshVaultBalance,
    refreshAllVaultBalances,
  };
};

export default useVaultBalanceHooks;
