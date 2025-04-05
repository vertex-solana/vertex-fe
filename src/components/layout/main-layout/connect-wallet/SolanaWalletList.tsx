"use client";

import React, { Fragment, useState } from "react";
import ReactDOM from "react-dom";

import { useAuthContext } from "@/context";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { CommonToggleButton } from "@/components/common";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";

import Connecting from "./Connecting";

const SolanaWalletList: React.FC<SolanaWalletListProps> = ({
  selectChainConnect,
  onClose,
}) => {
  const { t: getLabel } = useTranslation();
  const { wallets, select } = useWallet();
  const { handleDisconnect } = useAuthContext();

  const [wallet, setWallet] = useState<Wallet | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectLedger, setIsConnectLedger] = useState(false);

  const handleConnect = async (wallet: Wallet) => {
    if (isConnecting) return;
    setIsConnecting(true);

    select(wallet.adapter.name);

    await wallet.adapter.connect();

    setWallet(wallet);
  };

  const handleLogout = () => {
    handleDisconnect(selectChainConnect);
    onClose();
    setIsConnecting(false);
  };

  return (
    <>
      <div className={twJoin("w-full", "flex flex-col gap-y-4")}>
        <div
          className={twJoin(
            "px-4 py-2",
            "rounded-lg",
            "bg-characterBackground2",
            "text-sm text-neutral1 font-medium",
            "border border-characterBackground2",
            "flex flex-row justify-between items-center gap-x-2"
          )}
        >
          <div className="flex flex-col gap-y-1">
            <p className="text-sm font-medium">
              {getLabel("lAreYouUsingLedger")}
            </p>
            <p className="text-[#6B7280] text-xs">
              {getLabel("msgEnableToMake")}
            </p>
          </div>

          <CommonToggleButton
            checked={isConnectLedger}
            onCheckedChange={(checked) => setIsConnectLedger(checked)}
          />
        </div>

        {wallets
          .filter(
            (item) =>
              item?.readyState === "Installed" ||
              item?.adapter?.name === "Ledger"
          )
          .map((wallet, index) => (
            <WalletItem
              key={index}
              title={wallet?.adapter?.name}
              imgSrc={wallet?.adapter?.icon}
              onClick={() => {
                handleConnect(wallet);
              }}
            />
          ))}
      </div>

      {isConnecting && wallet ? (
        <>
          {ReactDOM.createPortal(
            <Connecting
              isConnectLedger={isConnectLedger}
              onClose={onClose}
              onLogout={handleLogout}
              selectChainConnect={selectChainConnect}
              selectedWallet={wallet}
              setIsConnecting={setIsConnecting}
            />,
            document.body
          )}
        </>
      ) : (
        <Fragment />
      )}
    </>
  );
};

export default SolanaWalletList;

interface SolanaWalletListProps {
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
