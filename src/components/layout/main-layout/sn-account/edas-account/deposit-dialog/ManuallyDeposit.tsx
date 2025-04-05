"use client";

import React, {
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";

import { LangConstant } from "@/const";
import { CopyIcon } from "@/components/icons";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { CommonUtils, FormatUtils } from "@/utils";
import { CommonButton } from "@/components/common";
import { useAccountContext, useAuthContext } from "@/context";
import { DepositLatestResponseInterface } from "@/models/account.model";
import { CommonButtonVariantEnum } from "@/components/common/common-button";

import useDeposit from "@/hooks/account-hooks/useDeposit";
import HeaderHighlight from "../HeaderHighlight";
import QRCode from "react-qr-code";
import Image from "next/image";

const ManuallyDeposit: React.FC<ManuallyDeposit> = ({
  selectedNetwork,
  onSwitch,
  depositData,
  setDepositData,
  syncSuccess,
  setSyncSuccess,
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { accountInfo, handleGetAccountInfo } = useAuthContext();
  const { handleSync, handleGetLatestDeposit } = useDeposit();
  const { handleAccountPortfolio, handleCustodialBalance } =
    useAccountContext();

  const [copySuccess, setCopySuccess] = useState(false);

  const date = new Date();

  const token = useMemo(() => {
    return CommonUtils.getChainBaseToken(selectedNetwork);
  }, [selectedNetwork]);

  const custodialWalletByChain = useMemo(() => {
    if (!accountInfo || !accountInfo.custodialWallets.length) return;

    return accountInfo.custodialWallets.find(
      (item) => item.chain === selectedNetwork
    );
  }, [accountInfo, selectedNetwork]);

  const handleCopyAddress = () => {
    if (!custodialWalletByChain?.address) return;

    navigator.clipboard.writeText(custodialWalletByChain?.address);
    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  const handleSyncDeposit = async (chain: SupportedChainEnum) => {
    const response = await handleSync(chain);

    if (!response) return;

    setSyncSuccess(true);
  };

  const handleGetDepositData = async () => {
    const response = await handleGetLatestDeposit(date);

    setDepositData(response);
  };

  useEffect(() => {
    if (!selectedNetwork) return;

    handleSyncDeposit(selectedNetwork);
  }, [selectedNetwork]);

  useEffect(() => {
    if (!syncSuccess || Boolean(depositData)) return;

    const getDepositDataInterval = setInterval(() => {
      handleGetDepositData();
      handleGetAccountInfo();
      handleAccountPortfolio();
    }, 5000);

    return () => clearInterval(getDepositDataInterval);
  }, [syncSuccess, depositData]);

  return (
    <>
      <div className={twJoin("w-full h-full", "flex flex-col gap-y-3")}>
        <HeaderHighlight
          label={<p className="px-4">{getAccountLabel("lDeposit")}</p>}
          buttonClassName="px-4"
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
          <p className="text-xs font-semibold">{getAccountLabel("lAsset")}</p>
          <ItemInfo
            imgSrc={CommonUtils.getTokenImageSrcByValue(token)}
            label={token}
          />

          {custodialWalletByChain && (
            <div
              className={twJoin(
                "w-full",
                "flex flex-col gap-y-3",
                "items-center justify-center"
              )}
            >
              <div className="p-1 bg-white rounded-md">
                <QRCode
                  size={118}
                  viewBox="0 0 118 118"
                  value={custodialWalletByChain.address}
                  style={{ height: "auto", maxWidth: "118px", width: "118px" }}
                />
              </div>
              <p className="text-center text-xs font-medium max-w-[182px] break-words">
                {custodialWalletByChain.address}
              </p>

              <div
                className={twJoin(
                  "p-2",
                  "text-center text-[11px]",
                  "w-full rounded-lg whitespace-pre-line",
                  depositData
                    ? "text-success2 bg-success1/10"
                    : "text-warning2 bg-[#FFE58F]/10"
                )}
              >
                {depositData
                  ? getAccountLabel("fmDepositSuccess", {
                      value: `${FormatUtils.formatNumber(
                        Number(depositData.amount),
                        2,
                        4
                      )} ${token}`,
                    })
                  : getAccountLabel("fmDepositMessage", {
                      token: token,
                      chain: selectedNetwork,
                    })}
                {}
              </div>
            </div>
          )}

          <CommonButton
            className="relative flex items-center rounded-full text-sm gap-x-2"
            onClick={handleCopyAddress}
          >
            <CopyIcon />
            {getAccountLabel("lCopy")}

            {copySuccess && (
              <span
                className={twJoin(
                  "text-[10px]",
                  "absolute -top-8 -right-3",
                  "p-1 rounded-sm bg-primary6"
                )}
              >
                Copied
              </span>
            )}
          </CommonButton>

          <CommonButton
            className="rounded-full text-sm bg-transparent"
            variant={CommonButtonVariantEnum.Gray}
            onClick={onSwitch}
          >
            {getAccountLabel("lDepositFromWallet")}
          </CommonButton>
        </div>
      </div>
    </>
  );
};

export default ManuallyDeposit;

interface ManuallyDeposit {
  selectedNetwork: SupportedChainEnum;
  onSwitch: () => void;
  depositData?: DepositLatestResponseInterface;
  setDepositData: React.Dispatch<
    SetStateAction<DepositLatestResponseInterface | undefined>
  >;
  syncSuccess: boolean;
  setSyncSuccess: React.Dispatch<SetStateAction<boolean>>;
}

export const ItemInfo: React.FC<ItemInfoProps> = ({
  imgSrc,
  label,
  labelClassName,
}) => {
  return (
    <div
      className={twJoin(
        "py-2 px-4",
        "w-full h-full",
        "flex items-center gap-x-2",
        "rounded-sm border-neutral7 border"
      )}
    >
      <Image
        width={26}
        height={26}
        alt="Chain"
        src={imgSrc}
        className="min-w-6 w-6 h-6"
      />
      <div className={twMerge("text-[13px] font-semibold", labelClassName)}>
        {label}
      </div>
    </div>
  );
};

interface ItemInfoProps {
  imgSrc: string;
  label: ReactNode;
  labelClassName?: string;
}
