"use client";

import React, { ComponentPropsWithoutRef, useMemo } from "react";

import { FormatUtils } from "@/utils";
import { LangConstant } from "@/const";
import { useAccountContext } from "@/context";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";

import CardWrapper from "./CardWrapper";

const AccountBalance = () => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { displayAccountPortfolioData } = useAccountContext();

  const accountBalance = useMemo(() => {
    return displayAccountPortfolioData.reduce((sum, current) => {
      return (sum += current.custodialPrice);
    }, 0);
  }, [displayAccountPortfolioData]);

  return (
    <CardWrapper
      contentClassName={twJoin(
        "font-medium",
        "pr-0 md:pr-2",
        "min-h-[124px]",
        "overflow-hidden",
        "flex justify-between items-center gap-x-1"
      )}
    >
      <InfoItem
        label={getAccountLabel("lTotalBalance")}
        content={`$${FormatUtils.formatNumber(accountBalance, 2)}`}
      />

      {/* <div className="relative">
        <p
          className={twJoin(
            "w-fit",
            "absolute top-0 right-8",
            "text-sm text-success1 font-semibold"
          )}
        >
          +${FormatUtils.formatNumber(MOCK_REVENUE, 3)}
        </p>

        <FixedChartIcon />
      </div> */}
    </CardWrapper>
  );
};

export default AccountBalance;

export const InfoItem: React.FC<InfoItemProps> = ({
  label,
  content,
  className,
  labelClassName,
  contentClassName,
}) => {
  return (
    <div
      className={twMerge(
        "h-full min-w-max",
        "flex flex-col gap-y-2 md:gap-y-3",
        className
      )}
    >
      <p
        className={twMerge("text-xs md:text-sm text-neutral4", labelClassName)}
      >
        {label}
      </p>
      <p className={twMerge("md:text-lg font-semibold", contentClassName)}>
        {content || "-"}
      </p>
    </div>
  );
};

interface InfoItemProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
  content?: string;
  labelClassName?: string;
  contentClassName?: string;
}
