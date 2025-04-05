"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";
import { twMerge } from "tailwind-merge";
import { useAppContext } from "@/context";
import { useTranslation } from "react-i18next";

const EligibilityCheckButton: FC<ComponentPropsWithoutRef<"button">> = ({
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  const { setIsOpenDrawerAccountSetting } = useAppContext();

  return (
    <button
      className={twMerge(
        "p-2",
        "rounded-lg",
        "bg-warning2/10",
        "font-jersey text-sm text-warning2",
        className
      )}
      onClick={() => {
        setTimeout(() => {
          setIsOpenDrawerAccountSetting(true);
        }, 100);
      }}
      {...otherProps}
    >
      {getLabel("lGrasslandNFTEligibilityCheck")}
    </button>
  );
};

export default EligibilityCheckButton;
