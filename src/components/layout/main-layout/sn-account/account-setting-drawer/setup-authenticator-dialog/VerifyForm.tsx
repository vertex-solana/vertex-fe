"use client";

import React, { useState } from "react";

import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useAuthContext } from "@/context";
import { useTranslation } from "react-i18next";

import { CommonButton, CommonInput } from "@/components/common";
import useAuthentication from "@/hooks/account-hooks/useAuthentication";

const VerifyForm: React.FC<VerifyFormProps> = ({ onClose }) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handlePostVerify2FA } = useAuthentication();
  const { handleGetAccountInfo } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");

  const handleChangeCode = (value: string) => {
    setErrorMessage("");
    setCode(value);
  };

  const handlePasteCode = async () => {
    const copiedValue = await navigator.clipboard.readText();
    if (!copiedValue) return;

    setCode(copiedValue);
  };

  const handleVerifyCode = async () => {
    const { error } = await handlePostVerify2FA(code);

    if (error) {
      setErrorMessage(error);
      return;
    }

    handleGetAccountInfo();
    onClose();
  };

  const handlePressEnter = (e: any) => {
    if ((e.charCode || e.keyCode) === 13) {
      e.preventDefault();
      handleVerifyCode();
    }
  };

  return (
    <div className={twJoin("w-full", "flex flex-col", "animate-fadeIn")}>
      <h3 className="text-xl font-medium mb-6">
        {getAccountLabel("lVerifyAuthenticator")}
      </h3>
      <p className="text-xs text-neutral4">
        {getAccountLabel("msgEnter6Digit")}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleVerifyCode();
        }}
        onKeyDown={handlePressEnter}
        className={twJoin(
          "w-full h-full",
          "flex flex-col justify-between gap-y-[238px]"
        )}
      >
        <div className="w-full">
          <CommonInput
            value={code}
            inputMode="numeric"
            type="number"
            inputWrapperClassName="w-full mt-2"
            placeholder={getAccountLabel("pAppCode")}
            className="placeholder:text-neutral5 w-full"
            onChange={(e) => {
              setErrorMessage("");
              handleChangeCode(e.target.value);
            }}
            endAdornment={
              <button
                onClick={handlePasteCode}
                className={twJoin(
                  "min-w-max",
                  "flex items-center gap-x-1",
                  "text-primary5 text-sm font-medium"
                )}
              >
                {getAccountLabel("lPaste")}
              </button>
            }
          />
          {errorMessage && (
            <p className="text-xs text-error2 self-start">{errorMessage}</p>
          )}
        </div>

        <CommonButton
          type="submit"
          disabled={!code}
          className="w-full rounded-full text-sm font-semibold"
        >
          {getAccountLabel("lSubmit")}
        </CommonButton>
      </form>
    </div>
  );
};

export default VerifyForm;

interface VerifyFormProps {
  onClose: () => void;
}
