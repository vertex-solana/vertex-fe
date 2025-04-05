"use client";

import React, { useState } from "react";

import { twJoin } from "tailwind-merge";
import { CommonDialog } from "@/components/common";
import { CommonDialogProps } from "@/components/common/common-dialog";

import SignInInput from "./SignInInput";
import VerifyCodeInput from "./VerifyCodeInput";

const SignInDialog: React.FC<SignInDialogProps> = ({
  isOpen,
  onClose,
  ...otherProps
}) => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    setIsSubmitted(false);
    setEmail("");
    setCode("");
    onClose();
  };

  const handleFocusInput = () => {
    setIsFocused(true);
  };

  const handleBlurInput = () => {
    setIsFocused(false);
  };

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={handleClose}
      isPreventCloseOutside={isSubmitted}
      contentClassName={twJoin(
        "py-5 px-6 bg-[#0F1011]",
        "rounded-none border-none",
        isFocused && "bottom-11 sm:bottom-auto"
      )}
      {...otherProps}
    >
      {isSubmitted ? (
        <VerifyCodeInput
          code={code}
          email={email}
          onClose={handleClose}
          onChangeCode={(value) => setCode(value)}
          onChangeNewEmail={() => {
            setEmail("");
            setIsSubmitted(false);
          }}
        />
      ) : (
        <SignInInput
          email={email}
          onChangeEmail={(value) => setEmail(value)}
          onSubmitEmailSuccess={(value) => setIsSubmitted(value)}
          onBlurInput={handleBlurInput}
          onFocusInput={handleFocusInput}
        />
      )}
    </CommonDialog>
  );
};

export default SignInDialog;

interface SignInDialogProps extends CommonDialogProps {}
