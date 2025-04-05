"use client";

import React, { Fragment, useEffect, useRef } from "react";
import {
  AirdropStatusEnum,
  SupportedChainEnum,
  AirdropStatusInterface,
  AirdropEligibleInterface,
} from "@/models";
import { useAuthContext, useHomeContext } from "@/context";

const GetHomeData = () => {
  const intervalEligible = useRef<any>();
  const intervalStatus = useRef<any>();
  const { accountAddresses } = useAuthContext();
  const {
    airdropStatus,
    airdropEligible,

    setAirdropStatus,
    handleEdasAirdrop,
    setAirdropEligible,
    handleAirdropStatus,
    handleAirdropEligible,
  } = useHomeContext();

  useEffect(() => {
    const walletAddress = accountAddresses.get(SupportedChainEnum.Solana);
    if (!walletAddress) {
      setAirdropStatus({} as AirdropStatusInterface);
      setAirdropEligible({} as AirdropEligibleInterface);

      return;
    }

    handleAirdropEligible(walletAddress);
    handleAirdropStatus(walletAddress);

    intervalEligible.current = setInterval(() => {
      handleAirdropEligible(walletAddress);
    }, 30000);

    intervalStatus.current = setInterval(() => {
      handleAirdropStatus(walletAddress);
    }, 30000);

    return () => {
      clearInterval(intervalEligible.current);
      clearInterval(intervalStatus.current);
    };
  }, [accountAddresses]);

  useEffect(() => {
    if (airdropStatus.status === AirdropStatusEnum.FINISHED) {
      clearInterval(intervalEligible.current);
      return;
    }

    if (airdropStatus.status === AirdropStatusEnum.CLAIMED) {
      clearInterval(intervalEligible.current);
      clearInterval(intervalStatus.current);
      return;
    }
  }, [airdropStatus, airdropEligible]);

  return <Fragment />;
};

export default GetHomeData;
