"use client";

import React, { useMemo } from "react";

import { SupportedChainEnum } from "@/models";
import { CommonDialog } from "@/components/common";

import SolanaWalletList from "@/components/layout/main-layout/connect-wallet/SolanaWalletList";

const ConnectWalletDialog: React.FC<ConnectWalletDialogProps> = ({
  chain,
  isOpen,
  onClose,
}) => {

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={'Connect Wallet'}
      isShowIconClose
      closeIconClassName="top-2 right-2"
      wrapperTitleClassName="mb-6"
    >
      <div className="w-full mt-5">
        <SolanaWalletList onClose={onClose} selectChainConnect={chain} />
      </div>
    </CommonDialog>
  );
};

export default ConnectWalletDialog;

interface ConnectWalletDialogProps {
  chain: SupportedChainEnum;
  isOpen: boolean;
  onClose: () => void;
}
