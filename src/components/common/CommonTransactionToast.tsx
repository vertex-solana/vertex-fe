"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  ExchangeIcon,
  CloseCircleIcon,
  ExternalLinkIcon,
  CheckRoundedIcon,
} from "../icons";

import { CommonUtils } from "@/utils";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { BlockchainTransactionStatusEnum, SupportedChainEnum } from "@/models";

import CommonToast from "./common-toast";

const CommonTransactionToast: React.FC<CommonTransactionToastProps> = ({
  status,
  children,

  selectedChain,
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
        title: getLabel("lTransactionSucceeded"),
        icon: <CheckRoundedIcon className="text-success1" />,
      };
    } else if (status === BlockchainTransactionStatusEnum.FAILED) {
      return {
        title: getLabel("lTransactionFailed"),
        icon: <CloseCircleIcon className="text-error2" />,
      };
    } else {
      return {
        title: getLabel("lTransactionSent"),
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
        <div className="flex items-center gap-x-2">
          {icon} {title}
        </div>
      }
      {...otherProps}
    >
      <div className={twMerge("flex flex-col gap-y-2", contentClassName)}>
        {status === BlockchainTransactionStatusEnum.LOADING ? (
          <span className="text-sm text-neutral4">
            {getLabel("lWaitingTransaction")}
          </span>
        ) : (
          <Fragment />
        )}

        {Boolean(transactionHash) ? (
          <a
            className={twJoin(
              "underline",
              "flex items-center gap-x-1",
              "text-primary5 font-semibold"
            )}
            href={CommonUtils.getTransactionHashInfoLink(
              selectedChain,
              transactionHash || ""
            )}
            target="_blank"
          >
            {getLabel("lViewYourTransaction")}
            <ExternalLinkIcon />
          </a>
        ) : (
          <Fragment />
        )}

        {children}
      </div>
    </CommonToast>
  );
};

export default CommonTransactionToast;

interface CommonTransactionToastProps
  extends React.ComponentPropsWithoutRef<"div"> {
  status?: BlockchainTransactionStatusEnum;

  selectedChain: SupportedChainEnum;
  transactionHash?: string;
  contentClassName?: string;
  onCloseCallback?: () => void;
}
