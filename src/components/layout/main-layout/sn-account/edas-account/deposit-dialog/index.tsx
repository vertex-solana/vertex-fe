"use client";

import React, { useState } from "react";

import { SupportedChainEnum } from "@/models";
import { CommonDialog } from "@/components/common";
import { useAppContext, useAuthContext } from "@/context";
import { DepositLatestResponseInterface } from "@/models/account.model";

import TransferToken from "./TransferToken";
import ManuallyDeposit from "./ManuallyDeposit";
import WrapperCard from "@/components/sn-dao/WrapperCard";
import ConnectWalletDialog from "../../account-setting-drawer/ConnectWalletDialog";

const DepositDialog: React.FC<DepositDialogProps> = ({
  isOpen,
  balance,
  selectedNetwork,

  onClose,
  onConnectWallet,
}) => {
  const { handleGetAccountInfo } = useAuthContext();
  const { chainConnectWallet, setChainConnectWallet } = useAppContext();

  const [isManuallyDeposit, setIsManuallyDeposit] = useState(true);

  const [syncSuccess, setSyncSuccess] = useState(false);
  const [depositData, setDepositData] = useState<
    DepositLatestResponseInterface | undefined
  >();

  const handleClose = () => {
    setSyncSuccess(false);
    setDepositData(undefined);
    setIsManuallyDeposit(false);
    handleGetAccountInfo();
    onClose();
  };

  return (
    <>
      <CommonDialog
        isOpen={isOpen}
        onClose={handleClose}
        contentClassName="p-0 rounded-lg sm:max-w-[380px]"
        closeIconClassName="top-2 right-2 z-20"
      >
        <WrapperCard
          className="px-0 sm:px-0 sm:py-4"
          wrapperCardClassName={"sm:min-h-fit"}
        >
          {isManuallyDeposit ? (
            <ManuallyDeposit
              selectedNetwork={selectedNetwork}
              onSwitch={() => setIsManuallyDeposit(false)}
              depositData={depositData}
              setDepositData={setDepositData}
              syncSuccess={syncSuccess}
              setSyncSuccess={setSyncSuccess}
            />
          ) : (
            <TransferToken
              balance={balance}
              onClose={handleClose}
              selectedNetwork={selectedNetwork}
              onConnectWallet={onConnectWallet}
              onBack={() => setIsManuallyDeposit(true)}
            />
          )}
        </WrapperCard>
      </CommonDialog>

      {chainConnectWallet && (
        <ConnectWalletDialog
          chain={chainConnectWallet}
          isOpen={Boolean(chainConnectWallet)}
          onClose={() => setChainConnectWallet(undefined)}
        />
      )}
    </>
  );
};

export default DepositDialog;

interface DepositDialogProps {
  isOpen: boolean;
  balance: number;
  selectedNetwork: SupportedChainEnum;
  onClose: () => void;
  onConnectWallet: () => void;
}
