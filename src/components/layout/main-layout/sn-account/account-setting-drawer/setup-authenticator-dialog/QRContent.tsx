"use client";

import React, { useState } from "react";

import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { CommonButton } from "@/components/common";
import { CopyIcon, QuestionIcon } from "@/components/icons";

import QRCode from "react-qr-code";

const QRContent: React.FC<QRContentProps> = ({
  qrAuthUrl,
  authenticatorData,
  onGoToNextStep,
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(authenticatorData);
    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  return (
    <div className={twJoin("w-full", "flex flex-col", "animate-fadeIn")}>
      <h3 className="text-xl font-medium mb-6">
        {getAccountLabel("l2FAVerify")}
      </h3>

      <div className="flex items-center gap-x-1 text-neutral4 mb-6">
        <p className="text-xs ">{getAccountLabel("msgScanQr")}</p>
        <button>
          <QuestionIcon />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="p-1 bg-white rounded-md">
          <QRCode
            size={152}
            style={{ height: "auto", maxWidth: "152px", width: "152px" }}
            value={qrAuthUrl}
            viewBox={`0 0 152 152`}
          />
        </div>

        <div className="relative flex items-center gap-x-1">
          <p className="text-sm font-semibold">{authenticatorData}</p>
          <button onClick={handleCopyCode}>
            <CopyIcon className="text-neutral5" />
          </button>

          {copySuccess && (
            <span
              className={twJoin(
                "text-[10px]",
                "absolute -top-6 -right-8",
                "p-1 rounded-sm bg-primary6"
              )}
            >
              Copied
            </span>
          )}
        </div>
        <p className="text-xs text-neutral4 text-center max-w-[290px]">
          {getAccountLabel("msgCannotScan")}
        </p>
      </div>

      <CommonButton
        onClick={onGoToNextStep}
        className="w-full rounded-full text-sm font-semibold mt-12"
      >
        {getAccountLabel("lNext")}
      </CommonButton>
    </div>
  );
};

export default QRContent;

interface QRContentProps {
  onGoToNextStep: () => void;
  qrAuthUrl: string;
  authenticatorData: string;
}
