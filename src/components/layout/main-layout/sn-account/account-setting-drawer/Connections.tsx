import React, { useEffect, useMemo } from "react";

import {
  generateCodeVerifier,
  generateCodeChallengeFromVerifier,
} from "@/utils/common.utils";

import { ImageAssets } from "public";
import { LangConstant } from "@/const";
import { useAuthContext } from "@/context";
import { SocialPlatformEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { EmailIcon, LinkIcon, UnlinkIcon } from "@/components/icons";

import Image from "next/image";
import AccordionItem from "./AccordionItem";
import useAuthentication from "@/hooks/account-hooks/useAuthentication";

const Connections = () => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { accountInfo, handleGetAccountInfo } = useAuthContext();
  const { handleGetXConnectUrl, handlePostXCallback, handleDisconnectX } =
    useAuthentication();

  const twitterAccount = useMemo(() => {
    return accountInfo?.connectedSocials.find(
      (item) => item.platform === SocialPlatformEnum.TWITTER
    );
  }, [accountInfo]);

  const handleConnectX = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);

    localStorage.removeItem("codeVerifier");
    localStorage.setItem("codeVerifier", codeVerifier);

    const data = await handleGetXConnectUrl(codeChallenge);

    if (data?.url) {
      window.location.href = data?.url;
    }
  };

  const handleConnectXCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code) {
      const codeVerifier = localStorage.getItem("codeVerifier");
      if (!codeVerifier) {
        return;
      }

      await handlePostXCallback(code, codeVerifier)
        .then((res) => {
          localStorage.removeItem("codeVerifier");
          const redirectUrl = res;

          if (redirectUrl) {
            window.location.href = redirectUrl;
          }
        })
        .catch((err) => console.log("err", err));
    }
  };

  const handleDisconnectTwitter = async () => {
    const res = await handleDisconnectX();

    if (res) {
      handleGetAccountInfo();
    }
  };

  useEffect(() => {
    handleConnectXCallback();
  }, []);

  return (
    <AccordionItem label={getAccountLabel("lConnections")}>
      <div className="flex items-center justify-between text-[13px] font-medium">
        <div className="flex items-center gap-x-2">
          <Image src={ImageAssets.XLogoImage} alt="" className="w-6 h-6" />
          <p>X</p>
        </div>
        {twitterAccount?.username ? (
          <button
            className="flex items-center gap-x-1"
            onClick={handleDisconnectTwitter}
          >
            <img
              src={twitterAccount?.avatar}
              alt=""
              className="w-4 h-4 rounded-full"
            />
            <p className="font-medium text-[13px] text-neutral4">
              {twitterAccount?.username}
            </p>
            <UnlinkIcon className="text-error2" />
          </button>
        ) : (
          <button
            onClick={handleConnectX}
            className="flex items-center gap-x-1 text-primary4"
          >
            <LinkIcon />
            <p className="font-medium text-[13px]">
              {getAccountLabel("lConnect")}
            </p>
          </button>
        )}
      </div>
      <div className="flex items-center justify-between text-[13px] font-medium">
        <div className="flex items-center gap-x-2">
          <EmailIcon className="text-neutral6" />
          <p>{getAccountLabel("lEmail")}</p>
        </div>
        <p>{accountInfo && accountInfo.account.email}</p>
      </div>
    </AccordionItem>
  );
};

export default Connections;
