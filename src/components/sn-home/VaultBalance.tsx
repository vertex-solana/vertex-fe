"use client";

import React, { FC, useState, useEffect, useRef } from "react";
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
  } = useVaultBalanceHooks();

  const balance =
    variant === VaultType.USER ? userVaultBalance : indexerVaultBalance;
  const isLoading = hookIsLoading;

  // Add refs to prevent duplicate requests
  const isRequestingRef = useRef(false);
  const lastRequestTimeRef = useRef(0);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getVaultBalance = async () => {
    if (!userInfo || !vaultAddress) {
      return;
    }

    // Prevent duplicate requests
    if (isRequestingRef.current) {
      console.log("VaultBalance: Request already in progress, skipping...");
      return;
    }

    // Throttle requests (max 1 per 2 seconds)
    const now = Date.now();
    if (now - lastRequestTimeRef.current < 2000) {
      console.log("VaultBalance: Request throttled, skipping...");
      return;
    }

    try {
      isRequestingRef.current = true;
      lastRequestTimeRef.current = now;

      console.log(
        `VaultBalance: Fetching ${variant} vault balance for address:`,
        vaultAddress
      );

      if (variant === VaultType.USER) {
        await getUserVaultBalance(vaultAddress);
      } else if (variant === VaultType.INDEXER) {
        await getIndexerVaultBalance(vaultAddress);
      }
    } catch (error) {
      console.error("Error fetching vault balance:", error);
    } finally {
      isRequestingRef.current = false;
    }
  };

  // Debounced version of getVaultBalance
  const debouncedGetVaultBalance = () => {
    if (requestTimeoutRef.current) {
      clearTimeout(requestTimeoutRef.current);
    }

    requestTimeoutRef.current = setTimeout(() => {
      getVaultBalance();
    }, 300); // 300ms debounce
  };

  useEffect(() => {
    if (userInfo && vaultAddress) {
      debouncedGetVaultBalance();
    }
  }, []);

  // Listen for refresh triggers
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaultBalanceRefresh" && userInfo && vaultAddress) {
        debouncedGetVaultBalance();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleCustomRefresh = () => {
      if (userInfo && vaultAddress) {
        console.log("VaultBalance: Refreshing due to custom event");
        debouncedGetVaultBalance();
      }
    };

    window.addEventListener("vaultBalanceRefresh", handleCustomRefresh);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("vaultBalanceRefresh", handleCustomRefresh);
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, [userInfo, vaultAddress]);

  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0 && userInfo && vaultAddress) {
      console.log("VaultBalance: Refreshing due to refreshTrigger prop");
      debouncedGetVaultBalance();
    }
  }, [refreshTrigger]);

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
