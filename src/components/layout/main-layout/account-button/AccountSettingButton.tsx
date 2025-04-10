"use client";

import React, { ComponentPropsWithoutRef } from "react";

import { CommonUtils } from "@/utils";
import { twJoin, twMerge } from "tailwind-merge";
import { useAppContext, useAuthContext } from "@/context";
import { ArrowIcon, DefaultAvatarIcon } from "@/components/icons";

const AccountSettingButton = () => {
  const { isOpenDrawerAccountSetting, setIsOpenDrawerAccountSetting } =
    useAppContext();

  return (
    <div>
      <button
        className={twJoin(
          "flex items-center gap-x-2",
          isOpenDrawerAccountSetting && "hidden"
        )}
        onClick={() => setIsOpenDrawerAccountSetting(true)}
      >
        <AccountInfo />
        <ArrowIcon className="text-neutral5" />
      </button>
    </div>
  );
};

export default AccountSettingButton;

export const AccountInfo: React.FC<AccountInfoProps> = ({
  className,
  ...otherProps
}) => {
  // const { accountInfo } = useAuthContext();
  return (
    <div
      className={twMerge("flex items-center gap-x-2", className)}
      {...otherProps}
    >
      <div
        className={twJoin(
          "p-1 text-white/40",
          "flex items-center justify-center",
          "border border-white/40 rounded-full"
        )}
      >
        <DefaultAvatarIcon />
      </div>

      <p className="font-medium text-sm">
        {/* {accountInfo && CommonUtils.truncateEmail(accountInfo.account.email)} */}
        user@gmail.com
      </p>
    </div>
  );
};

interface AccountInfoProps extends ComponentPropsWithoutRef<"div"> {}
