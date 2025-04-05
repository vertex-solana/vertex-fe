"use client";

import React, { ComponentPropsWithoutRef } from "react";

import { twJoin, twMerge } from "tailwind-merge";
import { CommonUtils, FormatUtils } from "@/utils";
import { SupportTokenType, SupportedChainEnum } from "@/models";

import Image from "next/image";

const AccountInfo: React.FC<AccountInfoProps> = ({
  chain,
  token,
  address,
  isActive,
  className,
  tokenBalance,
  balanceInUsd,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "rounded-lg relative",
        "px-4 py-3.5 bg-white/10",
        "flex items-center justify-between",
        tokenBalance === 0 ? "gap-x-[120px]" : "gap-x-20",
        className
      )}
      {...otherProps}
    >
      {isActive && (
        <div
          className={twJoin(
            "w-[3px] h-11",
            "rounded-full bg-primary5",
            "absolute -left-[2px] top-3"
          )}
        />
      )}

      <div className="flex items-center gap-x-1">
        <Image
          src={CommonUtils.getChainImageSrcByValue(chain)}
          alt={`${chain} logo`}
          className={twJoin("w-6 h-6 rounded-full")}
        />
        <div className="text-xs font-medium flex flex-col gap-y-1">
          <p>
            {
              Object.keys(SupportedChainEnum)[
                Object.values(SupportedChainEnum).indexOf(chain)
              ]
            }
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-y-1 items-end">
        <p className="text-sm font-semibold">
          {`${FormatUtils.formatNumber(tokenBalance, 4)} ${token ? token : ""}`}
        </p>
        <p className="text-xs text-neutral4">
          ${FormatUtils.formatNumber(balanceInUsd)}
        </p>
      </div>
    </div>
  );
};

export default AccountInfo;

interface AccountInfoProps extends ComponentPropsWithoutRef<"div"> {
  address: string;
  isActive?: boolean;
  tokenBalance: number;
  balanceInUsd: number;
  token?: SupportTokenType;
  chain: SupportedChainEnum;
}
