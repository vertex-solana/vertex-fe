"use client";

import React, { ComponentPropsWithoutRef, FC, useMemo } from "react";
import { CommonUtils } from "@/utils";
import { twMerge } from "tailwind-merge";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { AddCircleIcon } from "@/components/icons";
import { useAppContext, useAuthContext } from "@/context";

import Image from "next/image";

const ConnectMoreWallet: FC<ConnectMoreWalletProps> = ({
  className,
  onConnectWallet,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { activeNetwork } = useAppContext();
  const { accountAddresses } = useAuthContext();

  const listConnectMoreWallet = useMemo(() => {
    return activeNetwork.filter((item) => !accountAddresses?.get(item));
  }, [activeNetwork, accountAddresses]);

  return (
    listConnectMoreWallet.length > 0 && (
      <div
        className={twMerge("flex flex-col gap-y-4", className)}
        {...otherProps}
      >
        <p className="text-sm font-semibold text-neutral5">
          {getLabel("lConnectMoreWallet")}
        </p>

        {listConnectMoreWallet.map((item, index) => (
          <ListWalletConnectRow
            key={index}
            chain={item}
            label={
              Object.keys(SupportedChainEnum)[
                Object.values(SupportedChainEnum).indexOf(item)
              ]
            }
          >
            <button onClick={() => onConnectWallet(item)}>
              <AddCircleIcon className="w-6 h-6 text-primary5" />
            </button>
          </ListWalletConnectRow>
        ))}
      </div>
    )
  );
};

export default ConnectMoreWallet;

interface ConnectMoreWalletProps extends ComponentPropsWithoutRef<"div"> {
  onConnectWallet: (chain: SupportedChainEnum) => void;
}

export const ListWalletConnectRow: FC<ListWalletConnectRowProps> = ({
  label,
  chain,
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "px-4 py-3",
        "rounded-2xl",
        "bg-characterBackground2",
        "flex items-center justify-between",
        className
      )}
      {...otherProps}
    >
      <div className="flex items-center gap-x-4">
        <Image
          src={CommonUtils.getChainImageSrcByValue(chain)}
          alt=""
          className="w-10 h-10 rounded-full"
        />
        <p>{label}</p>
      </div>
      {children}
    </div>
  );
};

interface ListWalletConnectRowProps extends ComponentPropsWithoutRef<"div"> {
  chain: SupportedChainEnum;
  label: string;
}
