"use client";

import React from "react";

import { AppConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useWindowSize } from "@/hooks";
import { useAuthContext } from "@/context";
import { LogoutIcon } from "@/components/icons";
import { AccountInfo } from "@/components/layout/main-layout/account-button/AccountSettingButton";

import Cookies from "js-cookie";
import NftChecked from "./nft-checker";
import Connections from "./Connections";
import TwoFAVerify from "./TwoFAVerify";
import Drawer from "react-modern-drawer";
import WalletConnect from "./WalletConnect";
import "react-modern-drawer/dist/index.css";

const AccountSettingDrawer: React.FC<AccountSettingDrawerProps> = ({
  open,
  onClose,
}) => {
  const { windowWidth } = useWindowSize();
  const { accountInfo, setAccountInfo, handleDisconnectAll } = useAuthContext();

  const handleLogout = () => {
    setAccountInfo(undefined);
    Cookies.remove(AppConstant.KEY_TOKEN);
    handleDisconnectAll();
    onClose();
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        direction="right"
        size={windowWidth <= AppConstant.BREAK_POINTS.sm ? "100vw" : 378}
        className={twJoin("w-screen sm:w-[378px]", "!bg-[#0F1011]")}
      >
        <div
          className={twJoin(
            "px-4 py-6",
            "w-full h-full",
            "flex flex-col gap-4"
          )}
        >
          <div
            className="flex items-center justify-between border-b pb-4"
            style={{
              borderImageSlice: 30,
              borderImageSource:
                "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 55.92%, rgba(255, 255, 255, 0) 100%)",
            }}
          >
            <AccountInfo onClick={onClose} />
            {accountInfo?.account?.email && (
              <button onClick={handleLogout}>
                <LogoutIcon className="text-error2" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-y-4 overflow-y-auto">
            <NftChecked />

            {accountInfo?.account?.email && (
              <>
                <WalletConnect onCloseDrawer={onClose} />
                <Connections />
                <TwoFAVerify onCloseDrawer={onClose} />
              </>
            )}
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default AccountSettingDrawer;

interface AccountSettingDrawerProps {
  open: boolean;
  onClose: () => void;
}
