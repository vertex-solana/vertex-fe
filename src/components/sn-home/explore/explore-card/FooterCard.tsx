"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";

import { FormatUtils } from "@/utils";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { ButtonLinear } from "@/components/common";
import { LangConstant, PathConstant } from "@/const";
import { useAppContext, useAuthContext } from "@/context";
import { ExploreInterface, ExploreStatusEnum } from "@/models";

const FooterCard: FC<FooterCardProps> = ({
  className,
  exploreData,
  ...otherProps
}) => {
  const router = useRouter();
  const { t: getLabel } = useTranslation();
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { setIsOpenSignInDialog } = useAppContext();
  const { accountInfo } = useAuthContext();

  const handleClickButton = () => {
    if (!accountInfo?.account.email) {
      setIsOpenSignInDialog(true);

      return;
    }
    router.push(PathConstant.EDAS_ACCOUNT);
  };

  return (
    <div className="flex flex-col" {...otherProps}>
      <div
        className={twMerge(
          "py-4",
          "flex items-center justify-between",
          "border-t border-[#D387FF14]"
        )}
      >
        <FooterCardItem label="Marketcap">
          {exploreData.market_cap
            ? FormatUtils.convertLargeNumber(exploreData.market_cap)
            : "-"}
        </FooterCardItem>

        <FooterCardItem label="Portfolio">
          {exploreData.portfolio
            ? `${FormatUtils.convertLargeNumber(
                exploreData.portfolio?.balance
              )} ${exploreData.portfolio?.token}`
            : "-"}
        </FooterCardItem>

        {exploreData.status !== ExploreStatusEnum.COMING ? (
          <>
            {!accountInfo?.account.email ? (
              <ButtonLinear
                wrapperClassName="w-[114px]"
                onClick={handleClickButton}
                className="w-full flex items-center justify-center font-whiteRabbit uppercase"
              >
                {getAccountLabel("lSignIn")}
              </ButtonLinear>
            ) : (
              <ButtonLinear
                wrapperClassName="w-[114px]"
                onClick={handleClickButton}
                className="w-full flex items-center justify-center font-whiteRabbit uppercase"
              >
                {getLabel("lStart")}
              </ButtonLinear>
            )}
          </>
        ) : (
          <button
            disabled
            className={twJoin(
              "p-4 py-2.5",
              "bg-white/10",
              "font-whiteRabbit",
              "rounded-full border-[2px] border-white/5"
            )}
          >
            COMING
          </button>
        )}
      </div>

      {!accountInfo?.account.email && (
        <p className="text-sm font-medium text-neutral2/50 text-center">
          {getLabel("msgPleaseSignIn")}
        </p>
      )}
    </div>
  );
};

export default FooterCard;

interface FooterCardProps extends ComponentPropsWithoutRef<"div"> {
  exploreData: ExploreInterface;
}

const FooterCardItem: FC<FooterCardItemProps> = ({
  label,
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "text-sm font-medium",
        "flex flex-col gap-y-2",
        className
      )}
      {...otherProps}
    >
      <p className="text-white/50">{label}</p>
      {children}
    </div>
  );
};

interface FooterCardItemProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
}
