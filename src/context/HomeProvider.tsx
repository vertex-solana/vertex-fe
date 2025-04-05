"use client";

import React, { useContext, useState } from "react";
import {
  SupportedChainEnum,
  EdasAirdropInterface,
  AirdropStatusInterface,
  AirdropEligibleInterface,
} from "@/models";
import { HomeContextInterface } from "@/models/context.model";
import useHomeHooks from "@/hooks/home-hook";

const INITIAL_STATE = {} as HomeContextInterface;

const HomeContext = React.createContext(INITIAL_STATE);

export const useHomeContext = () => useContext(HomeContext);

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const {
    handleGetEdasAirdrop,
    handleGetAirdropStatus,
    handleGetAirdropEligible,
  } = useHomeHooks();

  const [edasAirdropData, setEdasAirdropData] = useState(
    {} as EdasAirdropInterface
  );
  const [airdropEligible, setAirdropEligible] = useState(
    {} as AirdropEligibleInterface
  );
  const [airdropStatus, setAirdropStatus] = useState(
    {} as AirdropStatusInterface
  );

  const [totalClaimedAirdrop, setTotalClaimedAirdrop] = useState(0);

  const handleEdasAirdrop = async () => {
    const airdropId = 1;
    const res = await handleGetEdasAirdrop(airdropId);

    setEdasAirdropData(res);
  };

  const handleAirdropEligible = async (walletAddress: string) => {
    const airdropId = 1;

    if (!walletAddress) return;

    const res = await handleGetAirdropEligible(
      airdropId,
      walletAddress,
      SupportedChainEnum.Solana
    );

    setAirdropEligible(res);
  };

  const handleAirdropStatus = async (walletAddress: string) => {
    const airdropId = 1;

    const res = await handleGetAirdropStatus(
      airdropId,
      walletAddress,
      SupportedChainEnum.Solana
    );

    setAirdropStatus(res);
  };

  return (
    <HomeContext.Provider
      value={{
        airdropStatus,
        edasAirdropData,
        airdropEligible,
        totalClaimedAirdrop,

        setAirdropStatus,
        handleEdasAirdrop,
        setAirdropEligible,
        handleAirdropStatus,
        handleAirdropEligible,
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};

interface HomeProviderProps {
  children: React.ReactNode;
}
