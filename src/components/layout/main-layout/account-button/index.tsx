"use client";

import React from "react";

import { useAppContext, useAuthContext } from "@/context";

import SignInButton from "./SignInButton";
import AccountSettingButton from "./AccountSettingButton";
import ConnectWalletDialog from "../sn-account/account-setting-drawer/ConnectWalletDialog";
import { SupportedChainEnum } from "@/models";
import { useWallet } from "@solana/wallet-adapter-react";

const AccountButton = () => {
  const { chainConnectWallet, setChainConnectWallet } = useAppContext();
  const  { wallet, connected, publicKey } = useWallet();

  return (
    <div className="flex items-center gap-x-5">
      {chainConnectWallet && (
        <ConnectWalletDialog
          chain={chainConnectWallet}
          isOpen={Boolean(chainConnectWallet)}
          onClose={() => setChainConnectWallet(undefined)}
        />
      )}

      {wallet && connected ? (
        <div>
          <AccountSettingButton />
          {/* {publicKey?.toBase58().slice(0, 4) +
            "..." +
            publicKey?.toBase58().slice(-4)} */}
        </div>
      ) : (
        <button
          className="flex items-center gap-x-1 text-primary4"
          onClick={() => {
            setChainConnectWallet(SupportedChainEnum.Solana);
          }}
        >
          <p className="font-medium text-[13px]">Connect Wallet</p>
        </button>
      )}
    </div>
  );
};

export default AccountButton;
