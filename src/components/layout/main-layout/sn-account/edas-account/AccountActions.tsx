"use client";

import React, { useEffect, useRef, useState } from "react";

import {
  CommonButton,
  DropdownRoot,
  DropdownTrigger,
  DropdownContent,
} from "@/components/common";

import {
  CopyIcon,
  MoreIcon,
  TurboTapIcon,
  ArrowRightUpIcon,
} from "@/components/icons";

import { isUndefined } from "lodash";
import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { useAccountContext, useAppContext } from "@/context";
import { SupportedChainEnum, GetStartedStatusEnum } from "@/models";
import { CommonButtonVariantEnum } from "@/components/common/common-button";

import DepositDialog from "./deposit-dialog";
import WithdrawDialog from "./withdraw-dialog";
import useAuthentication from "@/hooks/account-hooks/useAuthentication";
import SetupAuthenticatorDialog from "../account-setting-drawer/setup-authenticator-dialog";

const AccountActions: React.FC<AccountActionsProps> = ({
  balance,
  address,
  selectedNetwork,
}) => {
  const isAutoOpenDialog = useRef<boolean>(false);
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handlePostActivate2FA } = useAuthentication();
  const { stepStatusGetStarted } = useAccountContext();
  const { chainConnectWallet, setChainConnectWallet } = useAppContext();

  const [isOpenDeposit, setIsOpenDeposit] = useState(false);
  const [isOpenWithdraw, setIsOpenWithdraw] = useState(false);

  const [qrAuthUrl, setQrAuthUrl] = useState("");
  const [isOpenSetup, setIsOpenSetup] = useState(false);
  const [authenticatorData, setAuthenticatorData] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleOpenSetupDialog = async () => {
    setIsOpenSetup(true);
    setIsOpenWithdraw(false);

    const activateResponse = await handlePostActivate2FA();

    if (activateResponse?.secret) {
      setQrAuthUrl(activateResponse.otpAuthUrl);
      setAuthenticatorData(activateResponse.secret);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(address);
    setCopySuccess(true);

    setTimeout(() => {
      setCopySuccess(false);
    }, 1000);
  };

  const handleConnectWallet = () => {
    setIsOpenDeposit(false);
    setChainConnectWallet(selectedNetwork);
    isAutoOpenDialog.current = true;
  };

  useEffect(() => {
    if (isUndefined(chainConnectWallet) && isAutoOpenDialog.current === true) {
      setIsOpenDeposit(true);
    }
  }, [chainConnectWallet, isAutoOpenDialog.current]);

  return (
    <>
      <div className={twJoin("flex items-center justify-center gap-x-2.5")}>
        <CommonButton
          className={twJoin(
            "text-sm font-semibold",
            "rounded-full w-[146px] gap-x-2",
            "border-[2px]",
            stepStatusGetStarted.step3 === GetStartedStatusEnum.PROCESSING
              ? "border-warning2"
              : "border-white/20"
          )}
          variant={CommonButtonVariantEnum.Gray}
          onClick={() => setIsOpenDeposit(true)}
        >
          <ArrowRightUpIcon />
          {getAccountLabel("lDeposit")}
        </CommonButton>

        <TurboTapIcon className="w-6 h-6" />

        <DropdownRoot
          open={isOpenDropdown}
          onOpenChange={() => setIsOpenDropdown(!isOpenDropdown)}
        >
          <DropdownTrigger>
            <span>
              <MoreIcon />
            </span>
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
              className="flex items-center gap-x-2 py-4 w-full relative"
              onClick={handleCopyCode}
            >
              <CopyIcon className="w-4 h-4" />
              <p>Copy Address</p>

              {copySuccess && (
                <span
                  className={twJoin(
                    "text-[10px] ",
                    "absolute -bottom-4 left-1/2 -translate-x-1/2",
                    "p-1 rounded-sm bg-primary6"
                  )}
                >
                  Copied
                </span>
              )}
            </button>

            <button
              className="flex items-center gap-x-2 border-t border-neutral7 py-4 w-full"
              onClick={() => {
                setQrAuthUrl("");
                setIsOpenDropdown(false);
                setIsOpenWithdraw(true);
                setAuthenticatorData("");
              }}
            >
              <ArrowRightUpIcon className="rotate-180" />
              <p>{getAccountLabel("lWithdraw")}</p>
            </button>
          </DropdownContent>
        </DropdownRoot>
      </div>

      <DepositDialog
        balance={balance}
        isOpen={isOpenDeposit}
        selectedNetwork={selectedNetwork}
        onClose={() => setIsOpenDeposit(false)}
        onConnectWallet={handleConnectWallet}
      />

      <WithdrawDialog
        isOpen={isOpenWithdraw}
        selectedNetwork={selectedNetwork}
        onClose={() => setIsOpenWithdraw(false)}
        onSetupAuthenticator={handleOpenSetupDialog}
      />

      {authenticatorData && (
        <SetupAuthenticatorDialog
          isOpen={isOpenSetup}
          qrAuthUrl={qrAuthUrl}
          authenticatorData={authenticatorData}
          onClose={() => setIsOpenSetup(false)}
        />
      )}
    </>
  );
};

export default AccountActions;

interface AccountActionsProps {
  balance: number;
  address: string;
  selectedNetwork: SupportedChainEnum;
}
