"use client";

import React, { PropsWithChildren, useState } from "react";

import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useAuthContext } from "@/context";
import { useTranslation } from "react-i18next";
import { CoolDown } from "../sign-in-dialog/VerifyCodeInput";
import { CommonButton, CommonDialog, CommonInput } from "@/components/common";
import useAuthentication from "@/hooks/account-hooks/useAuthentication";

const Delete2FADialog: React.FC<Delete2FADialogProps> = ({
  isOpen,
  onClose,
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handlePostDeactivate2FA, handleEmailCode } = useAuthentication();
  const { accountInfo, handleGetAccountInfo } = useAuthContext();

  const [emailCode, setEmailCode] = useState("");
  const [authenticatorCode, setAuthenticatorCode] = useState("");

  const [errorEmailCode, setErrorEmailCode] = useState("");
  const [errorAuthenticatorCode, setErrorAuthenticatorCode] = useState("");
  const [isResendCode, setIsResendCode] = useState(false);

  const handleChangeEmailCode = (value: string) => {
    setEmailCode(value);
    setErrorEmailCode("");
  };

  const handleResendEmailCode = async () => {
    if (!accountInfo?.account) return;

    await handleEmailCode(accountInfo.account.email, "DEACTIVATE_2FA");

    setIsResendCode(true);
  };

  const handleChangeAuthenticatorCode = (value: string) => {
    setErrorAuthenticatorCode("");
    setAuthenticatorCode(value);
  };

  const handleSubmitDelete = async () => {
    if (!emailCode || !authenticatorCode) return;

    await handlePostDeactivate2FA(emailCode, authenticatorCode);
    handleGetAccountInfo();
    setAuthenticatorCode("");
    setEmailCode("");
    onClose();
  };

  const handlePressEnter = async (e: any) => {
    if ((e.charCode || e.keyCode) === 13) {
      e.preventDefault();
      handleSubmitDelete();
    }
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      contentClassName={twJoin(
        "py-5 px-6 bg-[#0F1011]",
        "rounded-none border-none"
      )}
    >
      <h3 className="text-xl font-medium mb-6">
        {getAccountLabel("lEnterToRemove")}
      </h3>

      <form
        className="relative w-full flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitDelete();
        }}
        onKeyDown={handlePressEnter}
      >
        <div
          className={twJoin(
            "absolute left-3 top-8",
            "w-[1px] h-[88px] bg-neutral7"
          )}
        />
        <div className="flex gap-x-2">
          <Stepper>1</Stepper>
          <div>
            <p className="text-sm font-medium">
              {getAccountLabel("msgEnterCode")}
            </p>
            <span className="text-sm font-medium text-characterUp">
              {accountInfo?.account?.email}
            </span>
          </div>
        </div>

        <div className="w-full pl-8">
          <CommonInput
            tabIndex={-1}
            value={emailCode}
            placeholder={getAccountLabel("pEnterCode")}
            inputWrapperClassName="w-full mt-2"
            className="placeholder:text-neutral5 w-full"
            onChange={(e) => {
              setErrorEmailCode("");
              handleChangeEmailCode(e.target.value);
            }}
            endAdornment={
              <button
                disabled={isResendCode}
                onClick={handleResendEmailCode}
                className={twJoin(
                  "min-w-max",
                  "flex items-center gap-x-1",
                  "text-primary5 text-sm font-medium",
                  isResendCode && "opacity-70 text-neutral5 pointer-events-none"
                )}
              >
                {getAccountLabel(isResendCode ? "lCodeSent" : "lSendCode")}
                {isResendCode && <CoolDown setIsResendCode={setIsResendCode} />}
              </button>
            }
          />
        </div>
        {errorEmailCode && (
          <p className="text-xs text-error2 self-start">{errorEmailCode}</p>
        )}

        <div className="flex gap-x-2 mt-5">
          <Stepper>2</Stepper>
          <p className="text-sm font-medium max-w-[270px]">
            {getAccountLabel("lEnterAuthenticatorCode")}
          </p>
        </div>

        <div className="w-full pl-8">
          <CommonInput
            value={authenticatorCode}
            placeholder={getAccountLabel("pEnterCode")}
            inputWrapperClassName="w-full mt-2"
            className="placeholder:text-neutral5 w-full"
            onChange={(e) => {
              setErrorAuthenticatorCode("");
              handleChangeAuthenticatorCode(e.target.value);
            }}
          />
        </div>
        {errorAuthenticatorCode && (
          <p className="text-xs text-error2 self-start">
            {errorAuthenticatorCode}
          </p>
        )}

        <CommonButton
          type="submit"
          disabled={!emailCode || !authenticatorCode}
          className="mt-16 rounded-full text-sm font-medium"
        >
          {getAccountLabel("lConfirm")}
        </CommonButton>
      </form>
    </CommonDialog>
  );
};

export default Delete2FADialog;

interface Delete2FADialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const Stepper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className={twJoin(
        "w-6 h-6 text-xs",
        "bg-neutral6 rounded-full",
        "flex items-center justify-center"
      )}
    >
      {children}
    </div>
  );
};
