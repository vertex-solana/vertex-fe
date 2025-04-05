"use client";

import React from "react";

import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useAppContext } from "@/context";
import { useTranslation } from "react-i18next";
import { CommonButton } from "@/components/common";

const SignInButton = () => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { setIsOpenSignInDialog } = useAppContext();

  return (
    <>
      <CommonButton
        className={twJoin(
          "text-sm font-semibold",
          "rounded-full border-[2px] border-white/20"
        )}
        onClick={() => {
          setTimeout(() => {
            setIsOpenSignInDialog(true);
          }, 100);
        }}
      >
        {getAccountLabel("lSignIn")}
      </CommonButton>
    </>
  );
};

export default SignInButton;
