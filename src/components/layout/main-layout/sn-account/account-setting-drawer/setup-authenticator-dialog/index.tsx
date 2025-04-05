"use client";

import React, { useState } from "react";

import { twJoin } from "tailwind-merge";
import { CommonDialog } from "@/components/common";

import QRContent from "./QRContent";
import VerifyForm from "./VerifyForm";

const SetupAuthenticatorDialog: React.FC<SetupAuthenticatorDialogProps> = ({
  isOpen,
  onClose,
  qrAuthUrl,
  authenticatorData,
}) => {
  const [isShowVerifyForm, setIsShowVerifyForm] = useState(false);

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={twJoin(
        "py-5 px-6 bg-[#0F1011]",
        "rounded-none border-none"
      )}
    >
      {isShowVerifyForm ? (
        <VerifyForm
          onClose={() => {
            setIsShowVerifyForm(false);
            onClose();
          }}
        />
      ) : (
        <QRContent
          qrAuthUrl={qrAuthUrl}
          authenticatorData={authenticatorData}
          onGoToNextStep={() => setIsShowVerifyForm(true)}
        />
      )}
    </CommonDialog>
  );
};

export default SetupAuthenticatorDialog;

interface SetupAuthenticatorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  qrAuthUrl: string;
  authenticatorData: string;
}
