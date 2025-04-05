"use client";

import React from "react";

import { ImageAssets } from "public";
import { LangConstant } from "@/const";
import { useTranslation } from "react-i18next";
import { CommonButton } from "@/components/common";

import Image from "next/image";

const Enable2FA: React.FC<Enable2FAProps> = ({ onSetupAuthenticator }) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  return (
    <div className="animate-fadeIn w-full flex flex-col items-center justify-center gap-y-2 px-4">
      <Image
        src={ImageAssets.TwoFAImage}
        alt="2 Factor"
        width={85}
        height={80}
        className="min-w-[85px] min-h-10 my-4"
      />

      <p className="text-sm text-center">
        {getAccountLabel("msgEnableForWithdraw")}
      </p>
      <p className="text-xs text-neutral5 text-center">
        {getAccountLabel("msgSetup")}
      </p>
      <CommonButton
        onClick={onSetupAuthenticator}
        className="w-full relative flex items-center rounded-full text-sm mt-2"
      >
        Enable 2FA
      </CommonButton>
    </div>
  );
};

export default Enable2FA;

interface Enable2FAProps {
  onClose: () => void;
  onSetupAuthenticator: () => void;
}
