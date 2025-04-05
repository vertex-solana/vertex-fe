"use client";

import React, {
  useState,
  ComponentPropsWithoutRef,
  SetStateAction,
} from "react";

import { CommonUtils } from "@/utils";
import { LangConstant } from "@/const";
import { ButtonLinear } from "../common";
import { AccountService } from "@/services";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";

const RegisterInput: React.FC<RegisterInputProps> = ({
  className,
  wrapperClassName,
  setIsRegisterSuccess,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const [email, setEmail] = useState("");
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [hasOtherError, setHasOtherError] = useState(false);
  const [isInvalidFormat, setInvalidFormat] = useState(false);

  const handleRegister = async () => {
    const isValidEmail = CommonUtils.checkEmailFormat(email);

    if (!isValidEmail) {
      setInvalidFormat(true);
      return;
    }

    const responseData = await AccountService.postPreRegister(email);
    if (responseData?.success) {
      setIsRegisterSuccess(true);
      return;
    } else if (responseData.statusCode === 409) {
      setIsEmailExist(true);
    } else {
      setHasOtherError(true);
    }
  };

  const handlePressEnter = (e: any) => {
    if ((e.charCode || e.keyCode) === 13) {
      e.preventDefault();
      handleRegister();
    }
  };

  return (
    <div
      className={twMerge(
        "mt-14",
        "flex flex-col",
        "items-center justify-center",
        wrapperClassName
      )}
    >
      <p
        className={twJoin(
          "mb-4 max-w-[352px]",
          "text-xs text-center",
          "whitespace-pre-wrap",
          isEmailExist ? "text-warning2" : "text-neutral5"
        )}
      >
        {isEmailExist
          ? getAccountLabel("msgAlreadySignup")
          : hasOtherError
          ? getLabel("msgSomethingWentWrong")
          : getAccountLabel("msgRegisterNow")}
      </p>

      <form
        onKeyDown={handlePressEnter}
        onSubmit={(e) => {
          e.preventDefault();
          handleRegister();
        }}
      >
        <div
          className={twJoin(
            "text-sm font-medium",
            "flex flex-col sm:flex-row",
            "gap-3 items-center justify-center"
          )}
        >
          <input
            value={email}
            placeholder={getAccountLabel("pYourEmail")}
            onChange={(e) => {
              setIsEmailExist(false);
              setInvalidFormat(false);
              setEmail(e.target.value);
            }}
            className={twMerge(
              "px-3 py-2 text-neutral1",
              "focus-visible:outline-none",
              "placeholder:text-neutral5",
              "h-10 w-[306px] bg-transparent",
              "border-[2px] rounded-lg border-white/20",
              className
            )}
            {...otherProps}
          />
          <ButtonLinear
            type="submit"
            wrapperClassName="rounded-lg"
            className="py-2 px-3 rounded-lg"
            disabled={isEmailExist || !email}
          >
            {getAccountLabel("lRegister")}
          </ButtonLinear>
        </div>
      </form>

      {isInvalidFormat && (
        <p className="text-xs text-error2 self-start">
          {getAccountLabel("msgInvalidEmail")}
        </p>
      )}
    </div>
  );
};

export default RegisterInput;

interface RegisterInputProps extends ComponentPropsWithoutRef<"input"> {
  wrapperClassName?: string;

  setIsRegisterSuccess: React.Dispatch<SetStateAction<boolean>>;
}
