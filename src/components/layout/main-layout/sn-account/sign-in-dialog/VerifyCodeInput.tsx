"use client";

import React, {
  useState,
  useEffect,
  SetStateAction,
  ComponentPropsWithoutRef,
} from "react";

import { useAuthContext } from "@/context";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { AppConstant, LangConstant } from "@/const";
import { useCountdownByDuration } from "@/hooks/useCountdown";
import { CommonButton, CommonInput } from "@/components/common";

import Cookies from "js-cookie";
import useAuthentication from "@/hooks/account-hooks/useAuthentication";

const VerifyCodeInput: React.FC<OTPCodeInputProps> = ({
  code,
  email,
  className,
  onClose,
  onChangeCode,
  onChangeNewEmail,
  ...otherProps
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handleGetAccountInfo } = useAuthContext();
  const { handlePostLogin, handleEmailCode } = useAuthentication();

  const [errorMessage, setErrorMessage] = useState("");
  const [isResendCode, setIsResendCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitCode = async () => {
    if (!code || !email) return;

    setIsSubmitting(true);

    const { accessToken, error } = await handlePostLogin(email, code);

    setIsSubmitting(false);

    if (accessToken) {
      Cookies.set(AppConstant.KEY_TOKEN, accessToken, {
        expires: AppConstant.COOKIE_EXPIRED_DATE,
      });

      handleGetAccountInfo();
      onClose();
    }

    if (error) {
      setErrorMessage(error);
    }
  };

  const handleResendToken = async () => {
    setIsResendCode(true);
    await handleEmailCode(email, "LOGIN");
  };

  const handlePressEnter = async (e: any) => {
    if ((e.charCode || e.keyCode) === 13) {
      e.preventDefault();
      handleSubmitCode();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitCode();
      }}
      onKeyDown={handlePressEnter}
      className={twMerge(
        "w-full",
        "flex flex-col",
        "animate-fadeIn",
        className
      )}
      {...otherProps}
    >
      <h3 className="text-xl font-medium mb-6">
        {getAccountLabel("lVerification")}
      </h3>
      <p className="text-sm font-medium">{getAccountLabel("msgEnterCode")}</p>
      {email && (
        <span className="text-sm font-medium text-characterUp">{email}</span>
      )}

      <CommonInput
        value={code}
        type="number"
        tabIndex={-1}
        inputMode="numeric"
        inputWrapperClassName="w-full mt-2"
        className="placeholder:text-neutral5 w-full"
        onChange={(e) => {
          setErrorMessage("");
          onChangeCode(e.target.value);
        }}
        endAdornment={
          <button
            disabled={isResendCode}
            onClick={handleResendToken}
            className={twJoin(
              "min-w-max",
              "flex items-center gap-x-1",
              "text-primary5 text-sm font-medium",
              isResendCode && "opacity-70 pointer-events-none"
            )}
          >
            {getAccountLabel("lResendCode")}
            {isResendCode && <CoolDown setIsResendCode={setIsResendCode} />}
          </button>
        }
      />
      {errorMessage && (
        <p className="text-xs text-error2 self-start">{errorMessage}</p>
      )}
      <CommonButton
        type="submit"
        disabled={!code || !email || isSubmitting}
        className="my-4 rounded-full text-sm font-medium"
      >
        {getAccountLabel("lSubmit")}
      </CommonButton>

      <button
        className="text-primary5 text-sm font-medium"
        onClick={() => {
          onChangeNewEmail();
          setErrorMessage("");
        }}
      >
        {getAccountLabel("lChangeEmail")}
      </button>
    </form>
  );
};

export default VerifyCodeInput;

interface OTPCodeInputProps extends ComponentPropsWithoutRef<"form"> {
  email: string;
  code: string;

  onClose: () => void;
  onChangeCode: (value: string) => void;
  onChangeNewEmail: () => void;
}

export const CoolDown = ({
  setIsResendCode,
}: {
  setIsResendCode: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const remainSecond = useCountdownByDuration(60, () => setIsResendCode(false));

  useEffect(() => {
    if (remainSecond !== null && remainSecond <= 0) {
      setIsResendCode(false);
    }
  }, [remainSecond]);
  return <span>{`(${remainSecond})`}</span>;
};
