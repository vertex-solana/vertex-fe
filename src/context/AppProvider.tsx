"use client";

import React, {
  FC,
  useMemo,
  useState,
  ReactNode,
  useContext,
  createContext,
  useEffect,
} from "react";

import {
  AssetInterface,
  SupportTokenType,
  ExploreInterface,
  UserInfoInterface,
  ExploreStatusEnum,
  SupportedChainEnum,
  PriceFeedInterface,
  ElanderEligibleInterface,
} from "@/models";

import { Map } from "immutable";
import { useAppService } from "@/hooks";
import { ActiveNetwork } from "@/const/app.const";
import { AppContextProps } from "@/models/context.model";

import "@/language";
import explore from "./explore.json";
import leaderboard from "./leaderboard.json";

const leaderBoardDataString = JSON.stringify(leaderboard);
const leaderBoardData = JSON.parse(leaderBoardDataString);

const exploreDataString = JSON.stringify(explore);
const exploreJsonData = JSON.parse(exploreDataString) as ExploreInterface[];

const INITIAL_STATE = {} as AppContextProps;

const AppContext = createContext(INITIAL_STATE);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const {
    handleGetAssets,
    handleGetElanderEligible,
    handleGetPythTokensPriceFeed,
  } = useAppService();

  const [isOpenSignInDialog, setIsOpenSignInDialog] = useState(false);

  const [chainConnectWallet, setChainConnectWallet] = useState<
    SupportedChainEnum | undefined
  >();

  const [userInfo, setUserInfo] = useState<UserInfoInterface>({});

  const [selectedChain, setSelectedChain] = useState(SupportedChainEnum.Solana);

  const [isOpenListWalletDialog, setIsOpenListWalletDialog] = useState(false);
  const [isSelectWalletConnect, setIsSelectWalletConnect] = useState(false);
  const [isOpenDrawerAccountSetting, setIsOpenDrawerAccountSetting] =
    useState(false);

  const [availableAssets, setAvailableAssets] = useState<
    Map<SupportedChainEnum, Map<SupportTokenType, AssetInterface>>
  >(Map<SupportedChainEnum, Map<SupportTokenType, AssetInterface>>());

  const [pythTokenPriceFeeds, setPythTokenPriceFeeds] = useState<
    Map<SupportedChainEnum, Map<SupportTokenType, PriceFeedInterface>>
  >(Map());

  const [elanderEligible, setElanderEligible] = useState(
    {} as ElanderEligibleInterface
  );

  const activeNetwork = useMemo(() => {
    const activeNetwork = Object.values(SupportedChainEnum).filter((item) => {
      return ActiveNetwork[item as keyof typeof ActiveNetwork];
    });

    return activeNetwork;
  }, []);

  const exploreData = useMemo(() => {
    return exploreJsonData.filter(
      (item) =>
        activeNetwork.includes(item.network) &&
        item.status !== ExploreStatusEnum.COMING
    );
  }, [activeNetwork]);

  const handleGetAvailableAssets = async () => {
    const res = await handleGetAssets();

    let availableAssets = Map<
      SupportedChainEnum,
      Map<SupportTokenType, AssetInterface>
    >();

    for (const asset of res) {
      if (!asset.chain || !asset.symbol) {
        continue;
      }

      const chainKey = asset.chain as SupportedChainEnum;
      const tokenKey = asset.symbol as SupportTokenType;

      let networkMap = availableAssets.get(
        chainKey,
        Map<SupportTokenType, AssetInterface>()
      );

      networkMap = networkMap.set(tokenKey, asset);

      availableAssets = availableAssets.set(chainKey, networkMap);
    }

    setAvailableAssets(availableAssets);
  };

  const handleGetPriceFeeds = async () => {
    let updatedTokenPriceFeeds = Map<
      SupportedChainEnum,
      Map<SupportTokenType, PriceFeedInterface>
    >();
    for (const network of activeNetwork) {
      const availableAssetsByChain = availableAssets.get(network);

      if (!availableAssetsByChain) continue;

      const tokensPriceFeeds = await handleGetPythTokensPriceFeed(
        availableAssetsByChain
      );

      updatedTokenPriceFeeds = updatedTokenPriceFeeds.set(
        network,
        tokensPriceFeeds
      );
    }

    setPythTokenPriceFeeds(updatedTokenPriceFeeds);
  };

  const handleElanderEligible = async () => {
    const res = await handleGetElanderEligible();

    setElanderEligible(res);
  };

  useEffect(() => {
    handleGetAvailableAssets();
  }, []);

  useEffect(() => {
    if (!activeNetwork || !availableAssets) return;
    handleGetPriceFeeds();

    const priceFeedInterval = setInterval(() => {
      handleGetPriceFeeds();
    }, 30000);

    return () => {
      clearInterval(priceFeedInterval);
    };
  }, [activeNetwork, availableAssets]);

  return (
    <AppContext.Provider
      value={{
        userInfo: userInfo,
        setUserInfo: setUserInfo,
        leaderBoardData,
        exploreData,
        selectedChain,
        setSelectedChain,
        activeNetwork,
        pythTokenPriceFeeds,

        isOpenListWalletDialog,
        setIsOpenListWalletDialog,
        isSelectWalletConnect,
        setIsSelectWalletConnect,
        isOpenSignInDialog,
        setIsOpenSignInDialog,
        chainConnectWallet,
        setChainConnectWallet,
        availableAssets,
        isOpenDrawerAccountSetting,
        setIsOpenDrawerAccountSetting,

        elanderEligible,
        handleElanderEligible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

interface AppProviderProps {
  children: ReactNode;
}
