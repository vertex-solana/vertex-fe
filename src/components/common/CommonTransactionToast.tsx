"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ExchangeIcon,
  CloseCircleIcon,
  ExternalLinkIcon,
  CheckRoundedIcon,
} from "../icons";

import { CommonUtils } from "@/utils";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { BlockchainTransactionStatusEnum } from "@/models";

import CommonToast from "./common-toast";

const CommonTransactionToast: React.FC<CommonTransactionToastProps> = ({
  status,
  children,

  transactionHash,
  contentClassName,

  onCloseCallback,

  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const [isOpenToast, setIsOpenToast] = useState(false);

  const { title, icon } = useMemo(() => {
    if (status === BlockchainTransactionStatusEnum.SUCCESS) {
      return {
        title: "Transaction succeeded",
        icon: <CheckRoundedIcon className="text-success1" />,
      };
    } else if (status === BlockchainTransactionStatusEnum.FAILED) {
      return {
        title: "Transaction failed",
        icon: <CloseCircleIcon className="text-error2" />,
      };
    } else {
      return {
        title: "Transaction sent",
        icon: <ExchangeIcon className="text-neutral1" />,
      };
    }
  }, [status, getLabel]);

  useEffect(() => {
    if (transactionHash) {
      setIsOpenToast(true);
    } else {
      setIsOpenToast(false);
    }
  }, [transactionHash, status]);

  return (
    <CommonToast
      open={isOpenToast}
      duration={20000}
      onOpenChange={() => {
        setIsOpenToast(false);
        if (onCloseCallback instanceof Function) {
          onCloseCallback();
        }
      }}
      toastTitle={
        <div className="flex items-center gap-x-2 text-white">
          {icon} {title}
        </div>
      }
      rootClassName="bg-[#1e2024] border border-neutral6 shadow-lg"
      {...otherProps}
    >
      <div className={twMerge("flex flex-col gap-y-3", contentClassName)}>
        {status === BlockchainTransactionStatusEnum.LOADING && (
          <span className="text-sm text-neutral5">
            {getLabel("lWaitingTransaction")}
          </span>
        )}

        {transactionHash && (
          <div className="flex flex-col gap-y-2">
            <div className="text-xs text-neutral5">
              Transaction Hash: {transactionHash.slice(0, 8)}...
              {transactionHash.slice(-8)}
            </div>
            <a
              className={twJoin(
                "inline-flex items-center gap-x-2",
                "px-3 py-2 rounded-lg",
                "bg-gradient-to-r from-[#6d2ef4] to-[#8b5cf6]",
                "hover:from-[#7c3aed] hover:to-[#9f7aea]",
                "text-white font-medium text-sm",
                "transition-all duration-200",
                "hover:shadow-lg hover:shadow-purple-500/25"
              )}
              href={CommonUtils.getTransactionHashInfoLink(
                transactionHash || ""
              )}
              target="_blank"
              rel="noopener noreferrer"
              onClickCapture={(e) => {
                e.stopPropagation();
              }}
            >
              View on Solana Explorer
              <ExternalLinkIcon className="w-4 h-4" />
            </a>
          </div>
        )}

        {children}
      </div>
    </CommonToast>
  );
};

export default CommonTransactionToast;

interface CommonTransactionToastProps
  extends React.ComponentPropsWithoutRef<"div"> {
  status: BlockchainTransactionStatusEnum | null;

  transactionHash?: string;
  contentClassName?: string;
  onCloseCallback?: () => void;
}
