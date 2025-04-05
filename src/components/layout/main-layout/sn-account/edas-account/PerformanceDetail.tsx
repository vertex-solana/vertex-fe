"use client";

import React, {
  FC,
  useRef,
  useMemo,
  useState,
  Fragment,
  useEffect,
} from "react";

import {
  DropdownRoot,
  DropdownContent,
  DropdownTrigger,
} from "@/components/common";

import {
  MoreIcon,
  RedeemIcon,
  TurboTapIcon,
  PortfolioIcon,
  AutomatedStrategyIcon,
  LPLeverageStrategyIcon,
  SelfPickedStrategyIcon,
} from "@/components/icons";

import {
  ExploreInterface,
  GetStartedStatusEnum,
  DisplayAccountPortfolioInterface,
} from "@/models";

import { ImageAssets } from "public";
import { FormatUtils } from "@/utils";
import { twJoin } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { CommonButton } from "@/components/common";
import { AppConstant, LangConstant } from "@/const";
import { useAccountContext, useAuthContext } from "@/context";
import { useAgentChatBotContext, useAppContext } from "@/context";
import { CommonButtonVariantEnum } from "@/components/common/common-button";

import HeaderHighlight from "./HeaderHighlight";

import Image from "next/image";
import RedeemDialog from "./fund-transfer/RedeemDialog";
import SupplyDialog from "./fund-transfer/SupplyDialog";
import useDeposit from "@/hooks/account-hooks/useDeposit";

const PerformanceDetail: FC<PerformanceDetailProps> = ({
  accountPortfolioDetail,
}) => {
  const isAutoChat = useRef<any>(false);
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { exploreData } = useAppContext();
  const {
    selectedAgent,
    agentChatList,
    agentsChatContent,

    setSelectedAgent,
    setAgentChatList,
    handleSubmitMessage,
  } = useAgentChatBotContext();

  const { handleGetAccountInfo } = useAuthContext();
  const { handleGetRedeemInfo, stepStatusGetStarted, handleAccountPortfolio } =
    useAccountContext();
  const { handleSyncCustodialBalance } = useDeposit();

  const [actionSuccess, setActionSuccess] = useState({
    label: "",
    amount: 0,
  });
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [isOpenReDeemDialog, setIsOpenReDeemDialog] = useState(false);
  const [isOpenDelegateDialog, setIsOpenDelegateDialog] = useState(false);

  const agent = useMemo(() => {
    return exploreData.find(
      (item) => item.network === accountPortfolioDetail.custodialWallet?.chain
    );
  }, [exploreData, accountPortfolioDetail]);

  const handleOpenChatBox = () => {
    if (!agent) return;

    setSelectedAgent(agent);
    isAutoChat.current = true;
    const isExist = agentChatList?.find((item) => item.id === agent.id);

    if (!isExist) {
      setAgentChatList([...(agentChatList || []), agent]);
    }
  };

  const handleActionSuccess = async (amount: number, label: string) => {
    setActionSuccess({
      label: label,
      amount: amount,
    });

    setTimeout(() => {
      handleSyncCustodialBalance(accountPortfolioDetail.custodialWallet?.chain);
      setTimeout(() => {
        handleGetAccountInfo();
        handleAccountPortfolio();
        setActionSuccess({
          label: "",
          amount: 0,
        });
      }, 3000);
    }, 15000);
  };

  useEffect(() => {
    if (selectedAgent && isAutoChat.current && agentsChatContent) {
      setTimeout(() => {
        handleSubmitMessage(AppConstant.MESSAGE_VIEW_PORTFOLIO_CHAT);
        isAutoChat.current = false;
      }, 500);
    }
  }, [selectedAgent, agentsChatContent]);

  useEffect(() => {
    if (!agent) return;

    handleGetRedeemInfo(agent.network);
  }, [agent]);

  return (
    <div className="w-full h-full flex flex-col">
      <HeaderHighlight
        className="justify-center sm:justify-start"
        label={
          <p className="text-xl sm:text-sm">{getAccountLabel("lFundDetail")}</p>
        }
      />
      <div className="flex flex-col md:flex-row justify-between mt-4 gap-5">
        <div className="w-full sm:min-w-[350px] flex flex-col gap-x-3 gap-y-4 text-xs font-semibold font-inter">
          <div className="flex items-center justify-between text-sm font-semibold">
            <p>{getAccountLabel("lUnallocatedFund")}</p>
            <p className={twJoin("mr-3")}>
              {`${
                accountPortfolioDetail.availableWalletAmount
                  ? FormatUtils.formatNumber(
                      accountPortfolioDetail.availableWalletAmount,
                      4,
                      4
                    )
                  : "-"
              } ${accountPortfolioDetail.custodialWallet?.asset?.symbol || ""}`}
            </p>
          </div>

          <span className="h-px w-full bg-white/30" />

          <div className="flex items-start justify-between text-sm font-semibold">
            <div className="flex items-center gap-x-2">
              <p>{getAccountLabel("fmManagedFund", { agent: agent?.name })}</p>
              <div
                className={twJoin(
                  "w-fit",
                  "shadow-shadowGreenLinearButton",
                  "border border-success3 rounded-full"
                )}
              >
                <img
                  src={agent?.image}
                  className="w-[20px] h-[20px] rounded-lg"
                />
              </div>
            </div>
            <p className={twJoin("mr-3")}>{`${
              accountPortfolioDetail.managedColossalAmount
                ? FormatUtils.formatNumber(
                    accountPortfolioDetail.managedColossalAmount,
                    4,
                    4
                  )
                : "-"
            } ${
              accountPortfolioDetail.custodialWallet?.asset?.symbol || ""
            }`}</p>
          </div>

          <div className="w-full bg-white/10 h-full rounded-2xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-1">
                <AutomatedStrategyIcon />
                <p className="text-xs font-semibold">
                  {getAccountLabel("lAutomatedStrategy")}
                </p>
              </div>
              <p>
                {`${
                  accountPortfolioDetail.automatedAmount
                    ? FormatUtils.formatNumber(
                        accountPortfolioDetail.automatedAmount,
                        4,
                        4
                      )
                    : "-"
                } ${
                  accountPortfolioDetail.custodialWallet?.asset?.symbol || ""
                }`}
              </p>
            </div>

            <div className="h-px w-full bg-white/20" />

            <div className="flex items-center justify-between">
              <div className="flex flex-col items-end mb-auto gap-y-1.5">
                <p className="font-normal text-white/70">
                  {getAccountLabel("lInitialSupply")}
                </p>
                <p>
                  {`${
                    accountPortfolioDetail.initialAmount
                      ? FormatUtils.formatNumber(
                          accountPortfolioDetail.initialAmount,
                          4,
                          4
                        )
                      : "-"
                  } ${
                    accountPortfolioDetail.custodialWallet?.asset?.symbol || ""
                  }`}
                </p>
              </div>

              <div className="flex flex-col items-end gap-y-1.5">
                <p className="font-normal text-white/70">
                  {getAccountLabel("lPnL")}
                </p>
                <p>
                  {`${
                    accountPortfolioDetail.pnl
                      ? FormatUtils.formatNumber(
                          accountPortfolioDetail.pnl,
                          4,
                          4
                        )
                      : "-"
                  } ${
                    accountPortfolioDetail.custodialWallet?.asset?.symbol || ""
                  }`}
                </p>
                <p
                  className={twJoin(
                    "font-light",
                    accountPortfolioDetail.pnlPercent <= 0
                      ? "text-error2"
                      : "text-green-500"
                  )}
                >
                  {`${FormatUtils.formatNumber(
                    accountPortfolioDetail.pnlPercent,
                    2,
                    2
                  )}%`}
                </p>
              </div>

              <div className="flex items-center justify-center gap-x-1.5 w-32">
                <CommonButton
                  variant={CommonButtonVariantEnum.Link}
                  className={twJoin(
                    "rounded-2xl",
                    "!border-[2px]",
                    "!px-2 !py-2 text-xs",
                    stepStatusGetStarted.step4 ===
                      GetStartedStatusEnum.PROCESSING
                      ? "!border-warning2"
                      : ""
                  )}
                  disabled={Boolean(
                    actionSuccess.amount > 0 && actionSuccess.label
                  )}
                  onClick={() => setIsOpenDelegateDialog(true)}
                >
                  {getAccountLabel("lSupply")}
                </CommonButton>

                <TurboTapIcon className="w-6 h-6" />

                <DropdownRoot
                  open={isOpenDropdown}
                  onOpenChange={() => setIsOpenDropdown(!isOpenDropdown)}
                >
                  <DropdownTrigger>
                    <MoreIcon className="w-5 h-5" />
                  </DropdownTrigger>
                  <DropdownContent
                    className={twJoin(
                      "overflow-hidden",
                      "w-[160px] px-4 mt-5",
                      "text-sm font-semibold",
                      "border border-white/10 bg-[#212B28]"
                    )}
                    align="end"
                  >
                    <button
                      className="flex items-center gap-x-2 border-t border-neutral7 py-4 w-full"
                      onClick={handleOpenChatBox}
                    >
                      <PortfolioIcon />
                      {getAccountLabel("lPortfolio")}
                    </button>

                    <button
                      className="flex items-center gap-x-2 border-t border-neutral7 py-4 w-full"
                      onClick={() => setIsOpenReDeemDialog(true)}
                      disabled={Boolean(
                        actionSuccess.amount > 0 && actionSuccess.label
                      )}
                    >
                      <RedeemIcon />
                      <p>{getAccountLabel("lRedeem")}</p>
                    </button>
                  </DropdownContent>
                </DropdownRoot>
              </div>
            </div>

            <>
              <div className="h-px w-full bg-white/20" />

              {actionSuccess.label && actionSuccess.amount && (
                <div
                  className={twJoin(
                    "text-xs text-warning2",
                    "flex items-center justify-between"
                  )}
                >
                  <p className="font-medium">{actionSuccess.label}</p>
                  <p className="font-semibold">{`${actionSuccess.amount} ${
                    accountPortfolioDetail.custodialWallet?.asset?.symbol || ""
                  }`}</p>
                </div>
              )}
            </>
          </div>

          <div className="w-full bg-white/10 h-full rounded-2xl p-3 space-y-3">
            <div className="flex items-center justify-between font-normal">
              <div className="flex items-center gap-x-1">
                <SelfPickedStrategyIcon />
                <p className="text-white/70">
                  {getAccountLabel("lSelfPickedStrategy")}
                </p>
              </div>
              <p>-</p>
            </div>

            <p className="font-normal text-xs text-white/50">
              {getAccountLabel("lComingSoon")}
            </p>
          </div>

          <div className="w-full bg-white/10 h-full rounded-2xl p-3 space-y-3">
            <div className="flex items-center justify-between font-normal">
              <div className="flex items-center gap-x-1">
                <LPLeverageStrategyIcon />
                <p className="text-white/70">
                  {getAccountLabel("lLPLeverageStrategy")}
                </p>
              </div>
              <p>-</p>
            </div>

            <p className="font-normal text-xs text-white/50">
              {getAccountLabel("lComingSoon")}
            </p>
          </div>
        </div>

        {accountPortfolioDetail &&
        accountPortfolioDetail.custodialWallet?.balance &&
        accountPortfolioDetail.userPositions?.length > 0 ? (
          <Image
            src={ImageAssets.ChartSoonImage}
            className="w-full max-h-[200px] sm:my-auto"
            alt="Coming soon"
          />
        ) : (
          <Fragment />
        )}
      </div>

      <SupplyDialog
        isOpen={isOpenDelegateDialog}
        onClose={() => setIsOpenDelegateDialog(false)}
        agentData={agent as ExploreInterface}
        accountPortfolioDetail={accountPortfolioDetail}
        onSupplySuccess={(supplyAmount) =>
          handleActionSuccess(
            supplyAmount,
            getAccountLabel("pSupplyInProgress")
          )
        }
      />

      <RedeemDialog
        isOpen={isOpenReDeemDialog}
        onClose={() => setIsOpenReDeemDialog(false)}
        agentData={agent as ExploreInterface}
        accountPortfolioDetail={accountPortfolioDetail}
        onRedeemSuccess={(redeemAmount) =>
          handleActionSuccess(
            redeemAmount,
            getAccountLabel("pRedeemInProgress")
          )
        }
      />
    </div>
  );
};

export default PerformanceDetail;

interface PerformanceDetailProps {
  accountPortfolioDetail: DisplayAccountPortfolioInterface;
}
