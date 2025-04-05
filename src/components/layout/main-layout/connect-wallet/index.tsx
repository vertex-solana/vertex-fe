"use client";

import React, { ComponentPropsWithoutRef, FC, useMemo } from "react";
import { CommonUtils } from "@/utils";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { CommonDialog } from "@/components/common";
import { useAppContext, useAuthContext } from "@/context";
import { ArrowDirectionIcon, ArrowIcon } from "@/components/icons";

import Image from "next/image";
import SuiWalletList from "./SuiWalletList";
import AptosWalletList from "./AptosWalletList";
import ConnectedWallet from "./ConnectedWallet";
import SolanaWalletList from "./SolanaWalletList";
import ConnectMoreWallet from "./ConnectMoreWallet";

const ConnectWallet = () => {
  const { t: getLabel } = useTranslation();
  const {
    activeNetwork,
    isOpenListWalletDialog,
    isSelectWalletConnect,
    setIsOpenListWalletDialog,
    setIsSelectWalletConnect,
  } = useAppContext();
  const { accountAddresses, selectChainConnect, setSelectChainConnect } =
    useAuthContext();

  const isConnected = useMemo(() => {
    if (!accountAddresses) return false;

    return activeNetwork?.some((item) => accountAddresses.get(item));
  }, [activeNetwork, accountAddresses]);

  const isSolanaWallet = useMemo(() => {
    return (
      selectChainConnect === SupportedChainEnum.Solana ||
      selectChainConnect === SupportedChainEnum.Eclipse ||
      selectChainConnect === SupportedChainEnum.Soon
    );
  }, [selectChainConnect]);

  const handleConnectWallet = (chain: SupportedChainEnum) => {
    setSelectChainConnect(chain);
    setIsSelectWalletConnect(true);
  };

  const handleClose = () => {
    setIsSelectWalletConnect(false);
    setIsOpenListWalletDialog(false);
  };

  return (
    <>
      {isConnected ? (
        <ListWalletButton onClick={() => setIsOpenListWalletDialog(true)} />
      ) : (
        <button
          className={twJoin(
            "py-2 px-6",
            "bg-primary6",
            "text-sm font-semibold",
            "rounded-full border-[2px] border-white/20"
          )}
          onClick={() => setIsOpenListWalletDialog(true)}
        >
          {getLabel("lConnectWallet")}
        </button>
      )}

      <CommonDialog
        isOpen={isOpenListWalletDialog}
        onClose={handleClose}
        dialogTitle={
          isSelectWalletConnect ? (
            <span className="flex items-center gap-x-2">
              <ArrowDirectionIcon
                className="w-6 h-6 rotate-180 text-neutral5 cursor-pointer"
                onClick={() => setIsSelectWalletConnect(false)}
              />
              <p className="text-neutral2">{getLabel("lSelect")}</p>
            </span>
          ) : (
            "Connect Wallet"
          )
        }
        isShowIconClose
        closeIconClassName="top-2 right-2"
        wrapperTitleClassName="mb-6"
      >
        {isSelectWalletConnect ? (
          <div className="w-full mt-5">
            {isSolanaWallet ? (
              <SolanaWalletList
                onClose={handleClose}
                selectChainConnect={selectChainConnect}
              />
            ) : selectChainConnect === SupportedChainEnum.Movement ? (
              <AptosWalletList
                onClose={handleClose}
                selectChainConnect={selectChainConnect}
              />
            ) : (
              <SuiWalletList
                onClose={handleClose}
                selectChainConnect={selectChainConnect}
              />
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-y-6">
            <ConnectedWallet />
            <ConnectMoreWallet
              onConnectWallet={(chain) => handleConnectWallet(chain)}
            />
          </div>
        )}
      </CommonDialog>
    </>
  );
};

export default ConnectWallet;

const ListWalletButton: FC<ComponentPropsWithoutRef<"button">> = ({
  className,
  ...otherProps
}) => {
  const { activeNetwork } = useAppContext();
  const { accountAddresses } = useAuthContext();

  return (
    <button
      className={twMerge(
        "px-4 py-3",
        "rounded-full",
        "bg-characterBackground2",
        "flex items-center gap-x-1.5",
        className
      )}
      {...otherProps}
    >
      <span className="flex items-center gap-x-2">
        {activeNetwork.map((item, index) => (
          <Image
            key={index}
            alt={`${item} logo`}
            src={CommonUtils.getChainImageSrcByValue(item)}
            className={twJoin(
              "w-6 h-6",
              "rounded-full",
              !accountAddresses.get(item) && "grayscale"
            )}
          />
        ))}
      </span>

      <ArrowIcon className="w-6 h-6" />
    </button>
  );
};
