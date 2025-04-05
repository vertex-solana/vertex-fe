"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";

import {
  ExploreInterface,
  SupportedChainEnum,
  BlockchainTransactionStatusEnum,
  DisplayAccountPortfolioInterface,
} from "@/models";

import { twJoin } from "tailwind-merge";
import { useAppContext } from "@/context";
import { useTranslation } from "react-i18next";
import { RefreshIcon } from "@/components/icons";
import { CommonUtils, FormatUtils } from "@/utils";
import { AppConstant, LangConstant } from "@/const";
import { ItemInfo } from "../deposit-dialog/ManuallyDeposit";
import { CommonButton, CommonDialog } from "@/components/common";

import HeaderHighlight from "../HeaderHighlight";
import useAccountHook from "@/hooks/account-hooks";
import WalletIcon from "@/components/icons/WalletIcon";
import WrapperCard from "@/components/sn-dao/WrapperCard";
import AmountInput from "@/components/sn-dao/amount-input";
import ErrorTransaction from "@/components/common/ErrorTransaction";

const SupplyDialog: React.FC<SupplyDialogDialogProps> = ({
  isOpen,
  agentData,
  accountPortfolioDetail,
  onClose,
  onSupplySuccess,
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);
  const { handlePostDelegate } = useAccountHook();
  const { pythTokenPriceFeeds } = useAppContext();

  const [delegateAmount, setDelegateAmount] = useState(0);
  const [messageWarning, setMessageWarning] = useState("");
  const [statusSupply, setStatusSupply] = useState<
    BlockchainTransactionStatusEnum | undefined
  >(undefined);

  const balance = useMemo(() => {
    if (!accountPortfolioDetail) return 0;
    return (
      accountPortfolioDetail.custodialWallet?.balance /
      Math.pow(10, accountPortfolioDetail.custodialWallet?.asset?.decimals)
    );
  }, [accountPortfolioDetail]);

  const delegatePrice = useMemo(() => {
    const price =
      pythTokenPriceFeeds
        .get(accountPortfolioDetail.custodialWallet?.asset?.chain)
        ?.get(accountPortfolioDetail.custodialWallet?.asset?.symbol)?.price ||
      0;

    return delegateAmount * price;
  }, [pythTokenPriceFeeds, delegateAmount, accountPortfolioDetail]);

  const labelButton = useMemo(() => {
    if (statusSupply === BlockchainTransactionStatusEnum.SUCCESS) {
      return getLabel("lSuccessfully");
    }

    if (statusSupply === BlockchainTransactionStatusEnum.LOADING) {
      return <RefreshIcon className="animate-spin" />;
    }

    return getAccountLabel("lSupply");
  }, [statusSupply]);

  const handleSupply = async () => {
    setMessageWarning("");
    setStatusSupply(BlockchainTransactionStatusEnum.LOADING);
    const res = await handlePostDelegate(
      delegateAmount *
        Math.pow(10, accountPortfolioDetail.custodialWallet?.asset?.decimals),
      accountPortfolioDetail.custodialWallet?.chain,
      accountPortfolioDetail.custodialWallet?.asset?.tokenAddress
    );

    if (res) {
      setStatusSupply(BlockchainTransactionStatusEnum.SUCCESS);

      setTimeout(() => {
        setStatusSupply(undefined);
        onSupplySuccess(delegateAmount);
        onClose();
      }, 1000);
    } else {
      setStatusSupply(BlockchainTransactionStatusEnum.FAILED);
    }
  };

  useEffect(() => {
    let message = "";

    if (delegateAmount > 0) {
      if (delegateAmount > balance) {
        message = getLabel("lInsufficientFund");
      } else if (
        delegateAmount >= balance - AppConstant.RESERVE_GAS_FEE ||
        balance < AppConstant.RESERVE_GAS_FEE
      ) {
        message = getAccountLabel("fmMinimumGasFee", {
          value: AppConstant.RESERVE_GAS_FEE,
        });
      } else if (delegateAmount < AppConstant.MINIMUM_SUPPLY) {
        message = getAccountLabel("fmMinimumSupply", {
          value: AppConstant.MINIMUM_SUPPLY,
        });
      }
    }

    setMessageWarning(message);
  }, [balance, delegateAmount]);

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
            label={<p className="px-4">{getAccountLabel("lSupply")}</p>}
            buttonClassName="px-4"
          />

          <div className="w-full flex flex-col gap-y-7 px-4">
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
              <div className="flex items-center justify-between text-xs font-medium">
                <p>From</p>

                <div
                  className={twJoin(
                    "flex items-center gap-x-2",
                    "px-3 py-2",
                    "rounded",
                    "bg-white/5"
                  )}
                >
                  <WalletIcon className="w-5 h-5 text-neutral5" />

                  <p className="">
                    {getAccountLabel("fmEDASAccount", {
                      wallet: CommonUtils.truncateHash(
                        accountPortfolioDetail.custodialWallet?.walletAddress
                      ),
                    })}
                  </p>
                </div>
              </div>

              <AmountInput
                decimalScale={4}
                labelEndAdornment={
                  <span className="inline-block text-xs">
                    {getLabel("fmWalletBalance", {
                      value: FormatUtils.formatNumber(balance, 4, 2),
                    })}
                  </span>
                }
                label={getAccountLabel("lYouSupply")}
                balance={balance}
                convertedValue={delegatePrice}
                value={delegateAmount}
                onChangeValue={(value) => setDelegateAmount(Number(value))}
                startAdornmentToken={
                  accountPortfolioDetail.custodialWallet?.asset?.symbol
                }
                startAdornmentImage={CommonUtils.getTokenImageSrcByValue(
                  accountPortfolioDetail.custodialWallet?.asset?.symbol
                )}
                onClickMax={() =>
                  setDelegateAmount(
                    Number(balance - AppConstant.RESERVE_GAS_FEE)
                  )
                }
              />

              {messageWarning && (
                <span
                  className={twJoin(
                    "p-2",
                    "rounded-lg",
                    "bg-[#FFE58F]/10",
                    "text-xs font-base text-neutral5 text-center text-warning2"
                  )}
                >
                  {messageWarning}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <p className="text-xs font-semibold">{getAccountLabel("lTo")}</p>
              <div
                className={twJoin(
                  "py-2 px-4",
                  "w-full h-full",
                  "flex items-center gap-x-2",
                  "rounded-sm border-neutral7 border"
                )}
              >
                <img
                  src={agentData?.image}
                  className={twJoin(
                    "w-6 h-6 min-w-6",
                    "shadow-shadowGreenLinearButton",
                    "border border-success3 rounded-full"
                  )}
                />

                <p className="text-sm font-">{agentData?.name}</p>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <CommonButton
                className="rounded-full text-sm"
                disabled={
                  statusSupply === BlockchainTransactionStatusEnum.LOADING ||
                  statusSupply === BlockchainTransactionStatusEnum.SUCCESS ||
                  delegateAmount === 0 ||
                  delegateAmount > balance ||
                  balance < AppConstant.RESERVE_GAS_FEE ||
                  delegateAmount < AppConstant.MINIMUM_SUPPLY ||
                  delegateAmount > balance - AppConstant.RESERVE_GAS_FEE
                }
                onClick={handleSupply}
              >
                {labelButton}
              </CommonButton>

              {statusSupply === BlockchainTransactionStatusEnum.SUCCESS ? (
                <ErrorTransaction
                  errorMessage={getLabel("msgSomethingWentWrong")}
                />
              ) : (
                <Fragment />
              )}

              {statusSupply === BlockchainTransactionStatusEnum.SUCCESS && (
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

export default SupplyDialog;

interface SupplyDialogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  agentData: ExploreInterface;
  onSupplySuccess: (supplyAmount: number) => void;
  accountPortfolioDetail: DisplayAccountPortfolioInterface;
}
