"use client";

import React, { Fragment, useMemo, useState } from "react";

import {
  ExploreInterface,
  SupportedChainEnum,
  BlockchainTransactionStatusEnum,
  DisplayAccountPortfolioInterface,
} from "@/models";

import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useAccountContext } from "@/context";
import { useTranslation } from "react-i18next";
import { RefreshIcon } from "@/components/icons";
import { CommonUtils, FormatUtils } from "@/utils";
import { ItemInfo } from "../deposit-dialog/ManuallyDeposit";
import { CommonButton, CommonDialog } from "@/components/common";
import HeaderHighlight, { Divider } from "../HeaderHighlight";

import useAccountHook from "@/hooks/account-hooks";
import WrapperCard from "@/components/sn-dao/WrapperCard";
import AmountInput from "@/components/sn-dao/amount-input";
import ErrorTransaction from "@/components/common/ErrorTransaction";

const RedeemDialog: React.FC<RedeemDialogDialogProps> = ({
  isOpen,
  agentData,
  accountPortfolioDetail,
  onClose,
  onRedeemSuccess,
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handlePostRedeem } = useAccountHook();
  const { redeemInfo } = useAccountContext();

  const [messageError, setMessageError] = useState("");
  const [statusRedeem, setStatusRedeem] = useState<
    BlockchainTransactionStatusEnum | undefined
  >(undefined);

  const labelButton = useMemo(() => {
    if (statusRedeem === BlockchainTransactionStatusEnum.SUCCESS) {
      return getLabel("lSuccessfully");
    }

    if (statusRedeem === BlockchainTransactionStatusEnum.LOADING) {
      return <RefreshIcon className="animate-spin" />;
    }

    return getAccountLabel("lRedeem");
  }, [statusRedeem]);

  const handleRedeem = async () => {
    setMessageError("");
    setStatusRedeem(BlockchainTransactionStatusEnum.LOADING);
    const res = await handlePostRedeem(
      accountPortfolioDetail.custodialWallet?.chain
    );

    if (res) {
      setStatusRedeem(BlockchainTransactionStatusEnum.SUCCESS);

      setTimeout(() => {
        setStatusRedeem(undefined);
        onRedeemSuccess(
          redeemInfo.totalRedeem - redeemInfo.totalPerformanceFee
        );
        onClose();
      }, 1000);
    } else {
      setMessageError(getLabel("msgSomethingWentWrong"));
      setStatusRedeem(BlockchainTransactionStatusEnum.FAILED);
    }
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      contentClassName="p-0 rounded-lg sm:max-w-[380px]"
      closeIconClassName="top-2 right-2"
    >
      <WrapperCard
        className="px-0 sm:px-0 sm:py-4"
        wrapperCardClassName={"sm:min-h-fit"}
      >
        <div className={twJoin("w-full h-full", "flex flex-col gap-y-3")}>
          <HeaderHighlight
            label={<p className="px-4">{getAccountLabel("lRedeem")}</p>}
            buttonClassName="px-4"
          />

          <div className="w-full flex flex-col gap-y-4 px-4">
            <div className="flex flex-col gap-y-2">
              <p className="text-xs font-semibold">
                {getAccountLabel("lNetwork")}
              </p>
              <ItemInfo
                imgSrc={CommonUtils.getChainImageSrcByValue(
                  accountPortfolioDetail.custodialWallet?.chain
                )}
                label={
                  Object.keys(SupportedChainEnum)[
                    Object.values(SupportedChainEnum).indexOf(
                      accountPortfolioDetail.custodialWallet?.chain
                    )
                  ]
                }
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-1 text-xs font-medium">
                <p className="mr-1">From</p>

                <img
                  src={agentData?.image}
                  className={twJoin(
                    "w-6 h-6 min-w-6",
                    "shadow-shadowGreenLinearButton",
                    "border border-success3 rounded-full"
                  )}
                />

                <p className="text-sm font-base">{agentData?.name}</p>
              </div>

              <AmountInput
                disabled
                decimalScale={4}
                labelEndAdornment={""}
                label={getAccountLabel("lYouRedeem")}
                balance={0}
                convertedValue={0}
                value={redeemInfo.totalRedeem}
                startAdornmentToken={
                  accountPortfolioDetail.custodialWallet?.asset?.symbol
                }
                startAdornmentImage={CommonUtils.getTokenImageSrcByValue(
                  accountPortfolioDetail.custodialWallet?.asset?.symbol
                )}
                isShowHalfMax={false}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <p className="text-xs font-semibold">{getAccountLabel("lTo")}</p>
              <ItemInfo
                imgSrc={CommonUtils.getChainImageSrcByValue(
                  accountPortfolioDetail.custodialWallet?.chain
                )}
                label={getAccountLabel("fmEDASAccount", {
                  wallet: CommonUtils.truncateHash(
                    accountPortfolioDetail.custodialWallet?.walletAddress
                  ),
                })}
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center justify-between text-xs">
                <p className=" text-neutral5">
                  {getAccountLabel("lPerformanceFee")}
                </p>
                <p>
                  {`${FormatUtils.formatNumber(
                    redeemInfo.totalPerformanceFee,
                    4
                  )} ${accountPortfolioDetail.custodialWallet?.asset?.symbol}`}
                </p>
              </div>

              <Divider />

              <div className="flex items-center justify-between text-xs">
                <p className=" text-neutral5">
                  {getAccountLabel("lYouReceive")}
                </p>
                <p>
                  {`${FormatUtils.formatNumber(
                    redeemInfo.totalRedeem - redeemInfo.totalPerformanceFee,
                    4
                  )} ${accountPortfolioDetail.custodialWallet?.asset?.symbol}`}
                </p>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <CommonButton
                className="rounded-full text-sm"
                onClick={handleRedeem}
                disabled={
                  statusRedeem === BlockchainTransactionStatusEnum.LOADING ||
                  statusRedeem === BlockchainTransactionStatusEnum.SUCCESS ||
                  redeemInfo.totalRedeem - redeemInfo.totalPerformanceFee === 0
                }
              >
                {labelButton}
              </CommonButton>

              {messageError ? (
                <ErrorTransaction errorMessage={messageError} />
              ) : (
                <Fragment />
              )}

              {statusRedeem === BlockchainTransactionStatusEnum.SUCCESS && (
                <span
                  className={twJoin(
                    "text-center text-sm break-words text-success2"
                  )}
                >
                  {getAccountLabel("msgSuccessfullyCheckPortfolio")}
                </span>
              )}
            </div>
          </div>
        </div>
      </WrapperCard>
    </CommonDialog>
  );
};

export default RedeemDialog;

interface RedeemDialogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agentData: ExploreInterface;
  onRedeemSuccess: (redeemAmount: number) => void;
  accountPortfolioDetail: DisplayAccountPortfolioInterface;
}
