"use client";

import React, { FC, useEffect, useRef } from "react";
import { twJoin } from "tailwind-merge";
import { WalletIcon } from "@/components/icons";
import { useAppContext } from "@/context";
import useVaultBalanceHooks from "@/hooks/billing-hooks/useVaultBalanceHooks";
import { VaultType } from "@/models/app.model";

interface VaultBalanceProps {
  variant?: VaultType;
  vaultAddress?: string;
  className?: string;
  showLabel?: boolean;
  refreshTrigger?: number;
}

const VaultBalance: FC<VaultBalanceProps> = ({
  variant = VaultType.USER,
  vaultAddress,
  className,
  showLabel = true,
  refreshTrigger,
}) => {
  const context = useAppContext();
  const userInfo = context?.userInfo;
  const {
    getUserVaultBalance,
    getIndexerVaultBalance,
    indexerVaultBalance,
    userVaultBalance,
    isLoading: hookIsLoading,
    refreshVaultBalance,
  } = useVaultBalanceHooks();

  const balance =
    variant === VaultType.USER ? userVaultBalance : indexerVaultBalance;
  const isLoading = hookIsLoading;
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!userInfo || !vaultAddress) {
      return;
    }

    if (!hasInitialized.current) {
      hasInitialized.current = true;

      if (variant === VaultType.USER) {
        getUserVaultBalance(vaultAddress);
      } else if (variant === VaultType.INDEXER) {
        getIndexerVaultBalance(vaultAddress);
      }
    }
  }, [
    userInfo,
    vaultAddress,
    variant,
    getUserVaultBalance,
    getIndexerVaultBalance,
  ]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0 && userInfo && vaultAddress) {
      refreshVaultBalance(variant, vaultAddress);
    }
  }, [refreshTrigger, userInfo, vaultAddress, variant, refreshVaultBalance]);

  useEffect(() => {
    const handleGlobalRefresh = () => {
      if (userInfo && vaultAddress) {
        console.log(`🌐 VaultBalance: Global refresh triggered for ${variant}`);
        refreshVaultBalance(variant, vaultAddress);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaultBalanceRefresh" && userInfo && vaultAddress) {
        console.log(
          `💾 VaultBalance: Storage refresh triggered for ${variant}`
        );
        refreshVaultBalance(variant, vaultAddress);
      }
    };

    window.addEventListener("vaultBalanceRefresh", handleGlobalRefresh);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("vaultBalanceRefresh", handleGlobalRefresh);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [userInfo, vaultAddress, variant, refreshVaultBalance]);

  const formatBalance = (amount: number) => {
    return amount.toFixed(4);
  };

  const getLabel = () => {
    if (variant === VaultType.USER) {
      return "User Vault";
    }
    return "Indexer Vault";
  };

  if (!userInfo) {
    return null;
  }

  try {
    return (
      <div
        className={twJoin(
          "flex items-center gap-x-2 px-3 py-2 rounded-lg bg-[#1e2024] border border-neutral6",
          className
        )}
      >
        <WalletIcon className="w-4 h-4 text-neutral5" />
        {showLabel && (
          <span className="text-sm text-neutral5 font-medium">
            {getLabel()}:
          </span>
        )}
        <div className="flex items-center gap-x-1">
          {isLoading ? (
            <div className="w-16 h-4 bg-neutral6 animate-pulse rounded" />
          ) : (
            <>
              <span className="text-sm font-semibold text-white">
                {formatBalance(balance)}
              </span>
              <span className="text-xs text-neutral5">SOL</span>
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering VaultBalance:", error);
    return (
      <div className="px-3 py-2 rounded-lg bg-[#1e2024] border border-neutral6">
        <span className="text-sm text-neutral5">Vault Balance: Error</span>
      </div>
    );
  }
};

export default VaultBalance;
