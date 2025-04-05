"use client";

import React, { useState, ComponentPropsWithoutRef } from "react";

import { CommonUtils } from "@/utils";
import { LangConstant } from "@/const";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { CommonButton, CommonInput } from "@/components/common";

import useAuthentication from "@/hooks/account-hooks/useAuthentication";

const SignInInput: React.FC<SignInInputProps> = ({
  email,
  className,
  onFocusInput,
  onBlurInput,
  onChangeEmail,
  onSubmitEmailSuccess,
  ...otherProps
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handleEmailCode } = useAuthentication();

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInvalidFormat, setIsInvalidFormat] = useState(false);

  const handleChangeEmail = (value: string) => {
    onChangeEmail(value);
    setErrorMessage("");
    setIsInvalidFormat(false);
  };

  const handleGetCode = async () => {
    if (isSubmitting || !email) return;

    const isValidEmail = CommonUtils.checkEmailFormat(email);

    if (!isValidEmail) {
      setIsInvalidFormat(true);
      return;
    }
    setIsSubmitting(true);

    const { isSuccess, error } = await handleEmailCode(email, "LOGIN");

    setIsSubmitting(false);

    if (isSuccess) {
      onSubmitEmailSuccess(true);
    }

    if (error) {
      setErrorMessage(error);
    }
  };

  const handlePressEnter = async (e: any) => {
    if ((e.charCode || e.keyCode) === 13) {
      e.preventDefault();
      handleGetCode();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleGetCode();
      }}
      onKeyDown={handlePressEnter}
      className={twMerge(
        "w-full",
        "animate-fadeIn",
        "flex flex-col gap-y-2",
        className
      )}
      {...otherProps}
    >
      <h3 className="text-xl font-medium">{getAccountLabel("lSignIn")}</h3>
      <p className="text-sm font-medium">{getAccountLabel("msgEnterEmail")}</p>
      <CommonInput
        value={email}
        type="email"
        tabIndex={-1}
        inputWrapperClassName="w-full mt-2"
        placeholder={getAccountLabel("pYourEmail")}
        className="placeholder:text-neutral5 w-full"
        onChange={(e) => handleChangeEmail(e.target.value)}
        onBlur={onBlurInput}
        onFocus={onFocusInput}
      />
      {(errorMessage || isInvalidFormat) && (
        <p className="text-xs text-error2 self-start">
          {errorMessage || getAccountLabel("msgInvalidEmail")}
        </p>
      )}
      <CommonButton
        type="submit"
        disabled={!email || isSubmitting}
        className="mt-2 rounded-full text-sm font-medium text-neutral1"
      >
        {getAccountLabel("lGetCode")}
      </CommonButton>
    </form>
  );
};

export default SignInInput;

interface SignInInputProps extends ComponentPropsWithoutRef<"form"> {
  email: string;
  onBlurInput: () => void;
  onFocusInput: () => void;
  onChangeEmail: (value: string) => void;
  onSubmitEmailSuccess: (value: boolean) => void;
}
