"use client";

import React, { useState } from "react";

import { ImageAssets } from "public";
import { LangConstant } from "@/const";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { LoadingIcon } from "@/components/icons";
import { useAccountContext, useAuthContext } from "@/context";
import { CommonButton, CommonInput } from "@/components/common";

import Image from "next/image";
import useWithdraw from "@/hooks/account-hooks/useWithdraw";

const Verify: React.FC<VerifyProps> = ({ address, chain, amount, onClose }) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handleWithdraw } = useWithdraw();
  const { handleGetAccountInfo } = useAuthContext();
  const { handleAccountPortfolio, handleCustodialBalance } =
    useAccountContext();

  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [code, setCode] = useState("");

  const handleChangeCode = (value: string) => {
    setWithdrawSuccess(false);
    setErrorMessage("");
    setCode(value);
  };

  const handleWithdrawToken = async () => {
    setIsWithdrawing(true);

    const { responseData, error } = await handleWithdraw(
      chain,
      amount,
      address,
      code
    );

    if (responseData) {
      handleGetAccountInfo();
      handleAccountPortfolio();
      handleCustodialBalance(chain);
      setWithdrawSuccess(true);
    } else {
      setErrorMessage(error);
    }

    setIsWithdrawing(false);
  };

  return (
    <div className="animate-fadeIn w-full flex flex-col items-center justify-center gap-y-2 px-4">
      <Image
        src={ImageAssets.TwoFAImage}
        alt="2 Factor"
        width={85}
        height={80}
        className="min-w-[85px] min-h-10 my-4"
      />

      <p className="text-sm text-center">
        {getAccountLabel("msgEnterTheCode")}
      </p>

      <div className="w-full">
        <CommonInput
          value={code}
          type="number"
          inputMode="numeric"
          inputWrapperClassName="w-full mt-2"
          placeholder={getAccountLabel("pCode")}
          className="placeholder:text-neutral5 w-full"
          onChange={(e) => {
            setErrorMessage("");
            handleChangeCode(e.target.value);
          }}
        />
        {errorMessage && (
          <p className="text-xs text-error2 self-start">{errorMessage}</p>
        )}
        {withdrawSuccess && (
          <p className="text-xs text-success2 self-start">
            {getAccountLabel("lWithdrawSuccessfully")}
          </p>
        )}
      </div>

      <CommonButton
        className="w-full relative flex items-center rounded-full text-sm mt-10"
        disabled={!code || isWithdrawing}
        onClick={() => {
          if (withdrawSuccess) {
            onClose();
            return;
          }
          handleWithdrawToken();
        }}
      >
        {isWithdrawing ? (
          <LoadingIcon className="animate-spin" />
        ) : (
          getAccountLabel(withdrawSuccess ? "lClose" : "lSubmit")
        )}
      </CommonButton>
    </div>
  );
};

export default Verify;

interface VerifyProps {
  amount: number;
  address: string;
  chain: SupportedChainEnum;
  onClose: () => void;
}
