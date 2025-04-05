"use client";

import React, { ComponentPropsWithoutRef, FC, useMemo } from "react";
import { FormatUtils } from "@/utils";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { ButtonLinear } from "@/components/common";
import { LangConstant, PathConstant } from "@/const";
import { useAccountContext, useAppContext } from "@/context";

import Link from "next/link";

const NotSignIn = () => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { accountStatistic } = useAccountContext();
  const { pythTokenPriceFeeds, setIsOpenSignInDialog } = useAppContext();

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
    <div className={twJoin("flex flex-col items-center", "mt-[95px] px-4")}>
      <p className="text-[32px] sm:text-[42px] font-whiteRabbit">
        {getAccountLabel("lEdasAccount")}
      </p>
      <span className="sm:max-w-[60%] text-center text-xs sm:text-sm mt-6">
        <p className="text-center">{getAccountLabel("msgAccountDesc")}</p>
        <Link
          href={PathConstant.EDAS_ACCOUNT_DOCS}
          className="text-primary4"
          target="_blank"
        >
          {getAccountLabel("lLearnMore")}
        </Link>
      </span>

      <div className={twJoin("flex items-center gap-x-4", "mt-8 mb-[60px]")}>
        <Statistic label={getAccountLabel("lAccounts")} className="items-end">
          {FormatUtils.formatNumber(accountStatistic.totalAccounts)}
        </Statistic>
        <div className="h-9 w-[1px] bg-white/30" />
        <Statistic
          label={getAccountLabel("lTotalAUM")}
          className="items-start"
        >{`$${FormatUtils.formatNumber(totalAUM)}`}</Statistic>
      </div>

      <ButtonLinear
        onClick={() => setIsOpenSignInDialog(true)}
        className={twJoin(
          "px-3 py-2",
          "rounded-lg",
          "font-whiteRabbit text-sm",
          "w-full flex items-center justify-center"
        )}
        wrapperClassName="rounded-lg"
      >
        {getAccountLabel("lSignIn")}
      </ButtonLinear>
    </div>
  );
};

export default NotSignIn;

const Statistic: FC<StatisticProps> = ({
  label,
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "flex flex-col gap-y-2",
        "text-sm sm:text-normal",
        className
      )}
      {...otherProps}
    >
      <p className="text-primary4">{label}</p>

      <div className="font-medium">{children}</div>
    </div>
  );
};

interface StatisticProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
}
