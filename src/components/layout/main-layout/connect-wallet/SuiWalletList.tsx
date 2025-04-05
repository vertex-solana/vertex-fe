"use client";

import React, { FC } from "react";
import { useAuthContext } from "@/context";
import { useWallets } from "@mysten/dapp-kit";
import { SupportedChainEnum } from "@/models";
import { twJoin, twMerge } from "tailwind-merge";

const SuiWalletList: FC<SuiWalletListProps> = ({
  selectChainConnect,
  onClose,
}) => {
  const wallets = useWallets();

  const { handleLoginSui } = useAuthContext();

  const handleConnect = async (wallet: any) => {
    onClose();

    await handleLoginSui(selectChainConnect, wallet);
  };

  return (
    <div className={twJoin("w-full", "flex flex-col gap-y-4")}>
      {wallets.map((wallet, index) => {
        return (
          <WalletItem
            key={index}
            title={wallet.name}
            imgSrc={wallet.icon}
            onClick={() => handleConnect(wallet)}
          />
        );
      })}
    </div>
  );
};

export default SuiWalletList;

interface SuiWalletListProps {
  selectChainConnect: SupportedChainEnum;
  onClose: () => void;
}

const WalletItem: React.FC<WalletItemProps> = ({
  title,
  imgSrc,
  className,
  ...otherProps
}) => {
  return (
    <button
      className={twMerge(
        "px-4 py-2",
        "rounded-lg",
        "flex flex-row justify-between items-center gap-x-2",
        "text-sm text-neutral1 font-medium",
        "border border-characterBackground2",
        "bg-characterBackground2 hover:bg-characterBackground3",
        className
      )}
      {...otherProps}
    >
      <div className="flex flex-row gap-x-4 items-center">
        <img
          width={40}
          height={40}
          src={imgSrc}
          alt={title}
          className="rounded-full"
        />
        <span>{title}</span>
      </div>
    </button>
  );
};

interface WalletItemProps extends React.ComponentPropsWithoutRef<"button"> {
  imgSrc: string;
  title: string;
}
