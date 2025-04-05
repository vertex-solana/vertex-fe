"use client";

import React, { Fragment, useEffect, useMemo, useState } from "react";

import { floor } from "lodash";
import { twJoin } from "tailwind-merge";
import { Divider } from "../HeaderHighlight";
import { SupportedChainEnum } from "@/models";
import { CloseIcon } from "@/components/icons";
import { useTranslation } from "react-i18next";
import { CommonButton } from "@/components/common";
import { LangConstant, AppConstant } from "@/const";
import { ItemInfo } from "../deposit-dialog/ManuallyDeposit";
import { BlockChainUtils, CommonUtils, FormatUtils } from "@/utils";
import { useAccountContext, useAppContext, useAuthContext } from "@/context";

import WalletIcon from "@/components/icons/WalletIcon";
import AmountInput from "@/components/sn-dao/amount-input";

const WithdrawInput: React.FC<WithdrawInputProps> = ({
  amount,
  setAmount,
  selectedNetwork,
  onGoToNextStep,
  addressValue,
  setAddressValue,
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { accountInfo } = useAuthContext();
  const { pythTokenPriceFeeds } = useAppContext();
  const { displayAccountPortfolioData } = useAccountContext();

  const [isShowWarningFee, setIsShowWarningFee] = useState(false);

  const token = useMemo(
    () => CommonUtils.getChainBaseToken(selectedNetwork),
    [selectedNetwork]
  );

  const infoData = useMemo(() => {
    return displayAccountPortfolioData.find(
      (itemInfo) => itemInfo.custodialWallet.chain === selectedNetwork
    );
  }, [displayAccountPortfolioData, selectedNetwork]);

  const maxWithdrawable = useMemo(() => {
    if (!infoData?.availableWalletAmount) return 0;

    const availableAmount = floor(infoData?.availableWalletAmount, 4);

    if (availableAmount < AppConstant.ESTIMATED_GAS_FEE) return 0;

    if (infoData?.userPositions.length === 0) {
      return availableAmount - AppConstant.ESTIMATED_TRANSFER_FEE;
    }

    return availableAmount - AppConstant.ESTIMATED_GAS_FEE;
  }, [infoData]);

  const insufficientBalance = useMemo(() => {
    return amount > Number(infoData?.availableWalletAmount || 0);
  }, [amount, infoData]);

  const withdrawPrice = useMemo(() => {
    const accountPortfolioDetail =
      displayAccountPortfolioData.get(selectedNetwork);

    if (!accountPortfolioDetail || !accountPortfolioDetail?.custodialWallet)
      return 0;

    const price =
      pythTokenPriceFeeds
        .get(accountPortfolioDetail?.custodialWallet?.asset?.chain)
        ?.get(accountPortfolioDetail?.custodialWallet?.asset?.symbol)?.price ||
      0;

    return amount * price;
  }, [
    pythTokenPriceFeeds,
    amount,
    selectedNetwork,
    displayAccountPortfolioData,
  ]);

  const isValidAddress = useMemo(() => {
    return BlockChainUtils.validateSolWalletAddress(addressValue);
  }, [addressValue]);

  const currentAccount = useMemo(() => {
    if (!accountInfo || !accountInfo.connectedWallets.length) return;

    return accountInfo.connectedWallets.find(
      (item) => item.chain === selectedNetwork
    );
  }, [accountInfo, selectedNetwork]);

  const custodialWalletByChain = useMemo(() => {
    if (!accountInfo || !accountInfo.custodialWallets.length) return;

    return accountInfo.custodialWallets.find(
      (item) => item.chain === selectedNetwork
    );
  }, [accountInfo, selectedNetwork]);

  const withdrawFee = useMemo(() => {
    return amount * (Number(process.env.NEXT_PUBLIC_WITHDRAW_FEE || 0) / 100);
  }, [amount]);

  useEffect(() => {
    if (!currentAccount || !currentAccount.address) return;

    setAddressValue(currentAccount.address);
  }, [currentAccount]);

  useEffect(() => {
    if (
      amount >= maxWithdrawable &&
      amount <= Number(infoData?.availableWalletAmount) &&
      infoData?.userPositions &&
      infoData?.userPositions.length > 0
    ) {
      setIsShowWarningFee(true);
    } else {
      setIsShowWarningFee(false);
    }
  }, [infoData, amount, maxWithdrawable]);

  return (
    <div className="animate-fadeIn w-full flex flex-col gap-y-2 px-4">
      <p className="text-xs font-semibold">{getAccountLabel("lNetwork")}</p>
      <ItemInfo
        imgSrc={CommonUtils.getChainImageSrcByValue(selectedNetwork)}
        label={
          Object.keys(SupportedChainEnum)[
            Object.values(SupportedChainEnum).indexOf(selectedNetwork)
          ]
        }
      />

      <div className="w-full flex items-center justify-between">
        <p className="text-xs font-semibold">{getAccountLabel("lFrom")}</p>
        <div
          className={twJoin(
            "px-3 py-2",
            "rounded-sm bg-white/5",
            "flex items-center justify-center gap-x-2"
          )}
        >
          <WalletIcon />
          <p className="text-xs">
            {getAccountLabel("fmEDASAccount", {
              wallet: CommonUtils.truncateHash(custodialWalletByChain?.address),
            })}
          </p>
        </div>
      </div>

      <AmountInput
        decimalScale={4}
        labelEndAdornment={
          <span className="inline-block text-xs">
            {getLabel("fmWalletBalance", {
              value: floor(infoData?.availableWalletAmount || 0, 4),
            })}
          </span>
        }
        onClickMax={() => {
          setAmount(maxWithdrawable);
        }}
        onClickHalf={() => setAmount(floor(maxWithdrawable / 2, 6))}
        startAdornmentToken={token}
        startAdornmentImage={CommonUtils.getTokenImageSrcByValue(token)}
        label={"You Withdraw"}
        balance={infoData?.availableWalletAmount || 0}
        convertedValue={withdrawPrice || 0}
        value={amount}
        onChangeValue={(value) => setAmount(Number(value))}
      />
      {insufficientBalance && (
        <p className="text-xs text-error2 self-start">
          {getAccountLabel("msgInsufficientBalance")}
        </p>
      )}

      {isShowWarningFee ? (
        <span
          className={twJoin(
            "p-2",
            "rounded-lg",
            "bg-[#FFE58F]/10",
            "text-xs font-base text-neutral5 text-center text-warning2"
          )}
        >
          {getAccountLabel("fmYouNeedAtLeast", {
            value: AppConstant.ESTIMATED_GAS_FEE,
          })}
        </span>
      ) : (
        <Fragment />
      )}

      <p className="text-xs font-semibold">{getAccountLabel("lTo")}</p>
      <ItemInfo
        imgSrc={CommonUtils.getChainImageSrcByValue(selectedNetwork)}
        labelClassName="w-full"
        label={
          <div className="w-full flex items-center justify-between">
            <input
              value={CommonUtils.truncateHash(addressValue)}
              placeholder={getAccountLabel("pEnterWallet")}
              onChange={(e) => setAddressValue(e.target.value)}
              className={twJoin(
                "w-full",
                "bg-transparent text-sm font-normal",
                "border-none focus-within:outline-none",
                "placeholder:text-neutral5 text-white"
              )}
            />

            {addressValue && (
              <button
                className="text-white/50 -mr-3"
                onClick={() => setAddressValue("")}
              >
                <CloseIcon width={24} height={24} />
              </button>
            )}
          </div>
        }
      />
      {!isValidAddress && addressValue && (
        <p className="text-xs text-error2 self-start">
          {getAccountLabel("msgInvalidAddress")}
        </p>
      )}

      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-neutral5">
          {getAccountLabel("lPlatformFee")}
        </p>
        <p className="text-xs">
          {FormatUtils.formatNumber(withdrawFee, 4, 4)} {token}
        </p>
      </div>

      <Divider className="my-3" />

      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral5">{getAccountLabel("lTotal")}</p>
        <p className="text-xs">
          {FormatUtils.formatNumber(amount - withdrawFee, 4, 4)} {token}
        </p>
      </div>

      <CommonButton
        className="relative flex items-center rounded-full text-sm mt-2"
        disabled={
          !amount ||
          !addressValue ||
          !accountInfo ||
          insufficientBalance ||
          !isValidAddress ||
          amount > maxWithdrawable
        }
        onClick={onGoToNextStep}
      >
        {getAccountLabel("lNext")}
      </CommonButton>
    </div>
  );
};

export default WithdrawInput;

interface WithdrawInputProps {
  selectedNetwork: SupportedChainEnum;
  onGoToNextStep: () => void;
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  addressValue: string;
  setAddressValue: React.Dispatch<React.SetStateAction<string>>;
}
