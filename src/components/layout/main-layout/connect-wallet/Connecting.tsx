"use client";

import React, {
  FC,
  Dispatch,
  useEffect,
  SetStateAction,
  ComponentPropsWithoutRef,
} from "react";
import { ImageAssets } from "public";
import { AppConstant } from "@/const";
import { twMerge } from "tailwind-merge";
import { useAuthContext } from "@/context";
import { SupportedChainEnum } from "@/models";
import { Wallet, useWallet } from "@solana/wallet-adapter-react";

import bs58 from "bs58";
import Image from "next/image";
import useSolanaAuthHooks from "@/hooks/auth-hooks/solana-auth-hooks";

const Connecting: FC<ConnectingProps> = ({
  className,
  selectedWallet,
  isConnectLedger,
  selectChainConnect,

  onClose,
  onLogout,
  setIsConnecting,
  ...otherProps
}) => {
  const { wallet } = useWallet();
  const { handleGetSolanaAddress } = useSolanaAuthHooks();

  const {
    accountAddresses,
    setAccountAddresses,
  } = useAuthContext();

  const handleLogin = async () => {
    try {
      const address = await handleGetSolanaAddress(selectedWallet);

      if (!address) {
        onLogout();
        return;
      }


      if (!true) {
        onLogout();
      } else {
        setAccountAddresses(accountAddresses.set(selectChainConnect, address));
        let addressKey = "";
        let appKey = "";
        switch (selectChainConnect) {
          case SupportedChainEnum.Solana:
            addressKey = AppConstant.KEY_SOL_WALLET_ADDRESS;
            appKey = AppConstant.KEY_SOL_WALLET_APP;
            break;
          case SupportedChainEnum.Eclipse:
            addressKey = AppConstant.KEY_ECLIPSE_WALLET_ADDRESS;
            appKey = AppConstant.KEY_ECLIPSE_WALLET_APP;
            break;
          case SupportedChainEnum.Soon:
            addressKey = AppConstant.KEY_SOON_WALLET_ADDRESS;
            appKey = AppConstant.KEY_SOON_WALLET_APP;
            break;
        }
        if (addressKey) {
          localStorage.setItem(addressKey, address);
          localStorage.setItem(appKey, selectedWallet.adapter.name);
        }

        onClose();
      }
    } catch (error) {
      console.log(error);
      onLogout();
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (
      !wallet ||
      !selectedWallet ||
      selectedWallet.adapter.publicKey?.toString() !==
        wallet.adapter.publicKey?.toString()
    )
      return;
    handleLogin();
  }, [selectedWallet, wallet, isConnectLedger]);

  return (
    <div
      className={twMerge(
        "z-[2000]",
        "w-screen h-screen",
        "fixed top-0 left-0",
        "bg-black opacity-75",
        "flex flex-col gap-y-3 items-center justify-center",
        className
      )}
      {...otherProps}
    >
      <div className="flex items-end font-medium">
        <span>Connecting</span>
        <span className="ml-1 flex space-x-1 mb-[6px]">
          <span className="w-1 h-1 bg-current rounded-full animate-bounce"></span>
          <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </span>
      </div>
    </div>
  );
};

export default Connecting;

interface ConnectingProps extends ComponentPropsWithoutRef<"div"> {
  isConnectLedger: boolean;
  selectedWallet: Wallet;
  selectChainConnect: SupportedChainEnum;
  onClose: () => void;
  onLogout: () => void;
  setIsConnecting: Dispatch<SetStateAction<boolean>>;
}
