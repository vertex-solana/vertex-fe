"use client";

import React, { useMemo } from "react";

import { FormatUtils } from "@/utils";
import { LangConstant } from "@/const";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { useAccountContext, useAppContext } from "@/context";

const EdasOverview = () => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { accountStatistic } = useAccountContext();
  const { pythTokenPriceFeeds } = useAppContext();

  const totalAUM = useMemo(() => {
    if (!accountStatistic.assetBalances || !pythTokenPriceFeeds.size) return 0;

    const total = accountStatistic.assetBalances.reduce((sum, current) => {
      const price =
        pythTokenPriceFeeds.get(current.asset.chain)?.get(current.asset.symbol)
          ?.price || 0;

      return (sum += current.balance * price);
    }, 0);

    return total;
  }, [accountStatistic, pythTokenPriceFeeds]);

  return (
    <div className={twJoin("flex items-center gap-x-3 h-fit")}>
      <Item
        className="items-end"
        label={getAccountLabel("lAccounts")}
        content={FormatUtils.formatNumber(accountStatistic.totalAccounts)}
      />
      <div className="h-10 w-[1px] bg-white/30" />
      <Item
        label={getAccountLabel("lTotalAUM")}
        content={`$${FormatUtils.formatNumber(totalAUM)}`}
      />
    </div>
  );
};

export default EdasOverview;

const Item = ({ label, content, className }: ItemProps) => {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-y-2 text-base sm:text-xl font-medium",
        className
      )}
    >
      <p className="text-primary4">{label}</p>
      <p>{content}</p>
    </div>
  );
};

interface ItemProps {
  label: string;
  content: string;
  className?: string;
}
