import { HomeService } from "@/services";
import {
  SupportedChainEnum,
  EdasAirdropInterface,
  AirdropStatusInterface,
  AirdropEligibleInterface,
} from "@/models";
import { BlockChainUtils } from "@/utils";
import { Program } from "@coral-xyz/anchor";

import * as web3 from "@solana/web3.js";

const useHomeHooks = () => {
  const handleGetEdasAirdrop = async (airdropId: number) => {
    const res = await HomeService.getAdasAirDrop(airdropId);

    if (res) {
      return res;
    } else {
      return {} as EdasAirdropInterface;
    }
  };

  const handleGetAirdropEligible = async (
    airdropId: number,
    walletAddress: string,
    network: SupportedChainEnum
  ) => {
    const res = await HomeService.getAirdropEligibleService(
      airdropId,
      walletAddress,
      network
    );

    if (res) {
      return res;
    } else {
      return {} as AirdropEligibleInterface;
    }
  };

  const handleGetAirdropStatus = async (
    airdropId: number,
    walletAddress: string,
    network: SupportedChainEnum
  ) => {
    const res = await HomeService.getAirdropStatusService(
      airdropId,
      walletAddress,
      network
    );

    if (res) {
      return res;
    } else {
      return {} as AirdropStatusInterface;
    }
  };

  return {
    handleGetEdasAirdrop,
    handleGetAirdropStatus,
    handleGetAirdropEligible,
  };
};

export default useHomeHooks;
