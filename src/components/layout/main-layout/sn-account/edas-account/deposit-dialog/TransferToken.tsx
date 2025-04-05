"use client";

import React, { useEffect, useMemo, useState } from "react";

import { floor } from "lodash";
import { twJoin } from "tailwind-merge";
import { ItemInfo } from "./ManuallyDeposit";
import { useTranslation } from "react-i18next";
import { CommonUtils, FormatUtils } from "@/utils";
import { CommonButton } from "@/components/common";
import { LangConstant, AppConstant } from "@/const";
import { ArrowDirectionIcon, LoadingIcon } from "@/components/icons";
import { useAccountContext, useAppContext, useAuthContext } from "@/context";
import { BlockchainTransactionStatusEnum, SupportedChainEnum } from "@/models";

import HeaderHighlight from "../HeaderHighlight";
import useTransaction from "@/hooks/blockchain-hooks";
import WalletIcon from "@/components/icons/WalletIcon";
import useDeposit from "@/hooks/account-hooks/useDeposit";
import AmountInput from "@/components/sn-dao/amount-input";

const TransferToken: React.FC<TransferTokenProps> = ({
  onBack,
  balance,
  selectedNetwork,
  onConnectWallet,
  onClose,
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handleTransferToken } = useDeposit();
  const { handleGetTransactionResult } = useTransaction();

  const { accountInfo } = useAuthContext();
  const { pythTokenPriceFeeds } = useAppContext();
  const {
    displayAccountPortfolioData,
    handleAccountPortfolio,
    handleCustodialBalance,
  } = useAccountContext();

  const [value, setValue] = useState(0);
  const [txData, setTxData] = useState<any>();
  const [txStatus, setTxStatus] = useState<
    BlockchainTransactionStatusEnum | undefined
  >();
  const [isDepositing, setIsDepositing] = useState(false);

  const convertedValue = useMemo(() => {
    const accountPortfolioDetail =
      displayAccountPortfolioData.get(selectedNetwork);

    if (!accountPortfolioDetail || !accountPortfolioDetail?.custodialWallet)
      return 0;

    const price =
      pythTokenPriceFeeds
        .get(accountPortfolioDetail?.custodialWallet?.asset?.chain)
        ?.get(accountPortfolioDetail?.custodialWallet.asset?.symbol)?.price ||
      0;

    return value * price;
  }, [value, displayAccountPortfolioData, pythTokenPriceFeeds]);

  const token = useMemo(() => {
    return CommonUtils.getChainBaseToken(selectedNetwork);
  }, [selectedNetwork]);

  const maxWithdrawable = useMemo(() => {
    if (!balance || balance < AppConstant.ESTIMATED_GAS_FEE) return 0;

    return balance - AppConstant.ESTIMATED_GAS_FEE;
  }, [balance]);

  const insufficientBalance = useMemo(() => {
    return value > Number(maxWithdrawable);
  }, [value, maxWithdrawable]);

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

  const handleGetTxStatus = async () => {
    if (!txData || !selectedNetwork) return;

    const status = await handleGetTransactionResult(
      selectedNetwork,
      txData.txHash,
      process.env.ECLIPSE_RPC_URL
    );

    setTxStatus(status);

    if (status !== BlockchainTransactionStatusEnum.LOADING) {
      setIsDepositing(false);
      handleAccountPortfolio();
    }
  };

  const handleTransfer = async () => {
    if (!currentAccount || !custodialWalletByChain) return;

    setIsDepositing(true);
    setTxStatus(BlockchainTransactionStatusEnum.LOADING);

    const data = await handleTransferToken(
      value,
      currentAccount.address,
      custodialWalletByChain.address
    );

    setTxData(data);
  };

  const handleCloseDialog = () => {
    setValue(0);
    setTxData(undefined);
    setIsDepositing(false);
    setTxStatus(undefined);
    onClose();
  };

  useEffect(() => {
    if (!txData || txStatus !== BlockchainTransactionStatusEnum.LOADING) return;

    const getStatusInterval = setInterval(async () => {
      handleGetTxStatus();
    }, 3000);

    return () => {
      clearInterval(getStatusInterval);
    };
  }, [txData, txStatus]);

  useEffect(() => {
    if (txStatus === BlockchainTransactionStatusEnum.SUCCESS) {
      setTimeout(() => {
        setValue(0);
        handleAccountPortfolio();
        handleCustodialBalance(selectedNetwork);
        setTxStatus(undefined);
      }, 3000);
    }
  }, [txStatus, selectedNetwork]);

  return (
    <div className={twJoin("w-full h-full", "flex flex-col gap-y-3")}>
      <HeaderHighlight
        label={
          <div className="flex items-center gap-x-1 px-4" onClick={onBack}>
            <ArrowDirectionIcon className="rotate-180 text-neutral5 text-[10px] w-5 h-5" />
            <p>{getAccountLabel("lDepositFromWallet")}</p>
          </div>
        }
      />
      <div className="w-full flex flex-col gap-y-2 px-4">
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
              {CommonUtils.truncateHash(currentAccount?.address)}
            </p>
          </div>
        </div>

        <AmountInput
          decimalScale={4}
          labelEndAdornment={
            <span className="inline-block text-xs">
              {getLabel("fmWalletBalance", {
                value: FormatUtils.formatNumber(balance, 6, 2),
              })}
            </span>
          }
          onClickMax={() => setValue(maxWithdrawable)}
          onClickHalf={() => setValue(floor(maxWithdrawable / 2, 4))}
          startAdornmentToken={token}
          startAdornmentImage={CommonUtils.getTokenImageSrcByValue(token)}
          label={getAccountLabel("lYouDeposit")}
          balance={balance}
          convertedValue={convertedValue}
          value={value}
          onChangeValue={(value) => setValue(Number(value))}
        />
        {insufficientBalance && (
          <p className="text-xs text-error2 self-start">
            {getAccountLabel("msgInsufficientBalance")}
          </p>
        )}

        <p className="text-xs font-semibold">{getAccountLabel("lTo")}</p>
        {custodialWalletByChain && (
          <ItemInfo
            imgSrc={CommonUtils.getChainImageSrcByValue(selectedNetwork)}
            label={`${getAccountLabel(
              "lEdasAccount"
            )} (${CommonUtils.truncateHash(
              custodialWalletByChain.address,
              4
            )})`}
          />
        )}

        {txData?.messageError && (
          <p className="text-xs text-error2 self-start">
            {txData.messageError}
          </p>
        )}

        {txStatus === BlockchainTransactionStatusEnum.SUCCESS && (
          <p className="text-xs text-success2 self-start mx-auto">
            {getAccountLabel("fmDepositSuccess", {
              value: `${value} ${token}`,
            })}
          </p>
        )}

        {currentAccount?.address ? (
          <CommonButton
            className="flex items-center rounded-full text-sm gap-x-2"
            onClick={() => {
              if (
                txStatus &&
                txStatus !== BlockchainTransactionStatusEnum.LOADING
              ) {
                handleCloseDialog();
                return;
              }

              handleTransfer();
            }}
            disabled={!value || isDepositing || !balance || insufficientBalance}
          >
            {!txStatus ? (
              getAccountLabel("lDeposit")
            ) : txStatus === BlockchainTransactionStatusEnum.LOADING ? (
              <LoadingIcon className="animate-spin" />
            ) : (
              getAccountLabel("lClose")
            )}
          </CommonButton>
        ) : (
          <CommonButton
            className="flex items-center rounded-full text-sm gap-x-2"
            onClick={onConnectWallet}
          >
            {getLabel("lConnectWallet")}
          </CommonButton>
        )}
      </div>
    </div>
  );
};

export default TransferToken;

interface TransferTokenProps {
  balance: number;
  selectedNetwork: SupportedChainEnum;

  onBack: () => void;
  onClose: () => void;
  onConnectWallet: () => void;
}
