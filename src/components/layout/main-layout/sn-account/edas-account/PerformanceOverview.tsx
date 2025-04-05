"use client";

import React, { FC, Fragment } from "react";

import { FormatUtils } from "@/utils";
import { useWindowSize } from "@/hooks";
import { twJoin } from "tailwind-merge";
import { InfoItem } from "./AccountBalance";
import { useTranslation } from "react-i18next";
import { AppConstant, LangConstant } from "@/const";
import { SupportTokenType } from "@/models/app.model";
import { DisplayAccountPortfolioInterface, SupportedChainEnum } from "@/models";

import CardWrapper from "./CardWrapper";
import ChatWithAgentButton from "./ChatWithAgentButton";

const PerformanceOverview: FC<PerformanceOverviewProps> = ({
  token,
  yourFund,
  netProfit,
  selectedNetwork,
  accountPortfolioDetail,
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { windowWidth } = useWindowSize();

  return (
    <CardWrapper
      className="h-[110px] md:h-[126px]"
      contentClassName={twJoin(
        "h-full",
        "font-medium",
        "overflow-hidden",
        "flex justify-between items-center"
      )}
    >
      <div className="h-full w-full md:w-auto flex justify-between gap-x-6">
        <InfoItem
          content={
            yourFund && token
              ? `${FormatUtils.formatNumber(yourFund, 4)} ${token}`
              : ""
          }
          label={getAccountLabel("lEclipseFund")}
          className="w-auto md:min-w-[140px]"
        />
        <InfoItem
          content={
            netProfit
              ? `${FormatUtils.formatNumber(netProfit, 4)} ${token}`
              : ""
          }
          label={getAccountLabel("lNetProfit")}
          className="w-auto md:min-w-[140px]"
        />
        <InfoItem
          content=""
          label={getAccountLabel("l24hPnl")}
          className="w-auto md:min-w-[140px]"
          contentClassName="text-success1"
        />
      </div>

      {windowWidth > AppConstant.BREAK_POINTS.md &&
      accountPortfolioDetail.custodialWallet?.walletAddress ? (
        <ChatWithAgentButton selectedNetwork={selectedNetwork} />
      ) : (
        <Fragment />
      )}
    </CardWrapper>
  );
};

export default PerformanceOverview;

interface PerformanceOverviewProps {
  yourFund?: number;
  netProfit?: number;
  token?: SupportTokenType;
  selectedNetwork: SupportedChainEnum;
  accountPortfolioDetail: DisplayAccountPortfolioInterface;
}
