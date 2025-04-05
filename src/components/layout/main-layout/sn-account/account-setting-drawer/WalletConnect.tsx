import React from "react";

import { CommonUtils } from "@/utils";
import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { useAppContext, useAuthContext } from "@/context";
import { LinkIcon, UnlinkIcon } from "@/components/icons";

import Image from "next/image";
import AccordionItem from "./AccordionItem";
import useAuthentication from "@/hooks/account-hooks/useAuthentication";

const WalletConnect: React.FC<WalletConnectProps> = ({ onCloseDrawer }) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { handleUnlinkWallet } = useAuthentication();
  const { activeNetwork, setChainConnectWallet } = useAppContext();
  const { accountInfo, handleDisconnect, handleGetAccountInfo } =
    useAuthContext();

  const handleUnlinkAddress = async (
    chain: SupportedChainEnum,
    address: string
  ) => {
    handleDisconnect();

    await handleUnlinkWallet(chain, address);
    handleGetAccountInfo();
    onCloseDrawer();
  };

  return (
    <AccordionItem label={getAccountLabel("lWallets")}>
      {activeNetwork.map((item, index) => {
        const linkedAddress = accountInfo?.connectedWallets?.find(
          (data) => data.chain === item
        );

        return (
          <div className="flex items-center justify-between" key={index}>
            <div
              className={twJoin(
                "text-[13px] font-medium",
                "flex items-center gap-x-4"
              )}
            >
              <Image
                alt={`${item} Chain`}
                src={CommonUtils.getChainImageSrcByValue(item)}
                className="w-6 h-6 rounded-full"
              />
              <p>
                {
                  Object.keys(SupportedChainEnum)[
                    Object.values(SupportedChainEnum).indexOf(item)
                  ]
                }
              </p>
            </div>

            {linkedAddress ? (
              <button
                className="flex items-center gap-x-1"
                onClick={() => {
                  handleUnlinkAddress(item, linkedAddress.address);
                }}
              >
                <p className="font-medium text-[13px] text-neutral4">
                  {CommonUtils.truncateHash(linkedAddress.address, 6)}
                </p>
                <UnlinkIcon className="text-error2" />
              </button>
            ) : (
              <button
                className="flex items-center gap-x-1 text-primary4"
                onClick={() => {
                  onCloseDrawer();
                  setChainConnectWallet(item);
                }}
              >
                <LinkIcon />
                <p className="font-medium text-[13px]">
                  {getAccountLabel("lConnect")}
                </p>
              </button>
            )}
          </div>
        );
      })}
    </AccordionItem>
  );
};

export default WalletConnect;

interface WalletConnectProps {
  onCloseDrawer: () => void;
}
