"use client";

import React, { useContext, useEffect, useState } from "react";

import { Map } from "immutable";
import { useAppContext } from ".";
import { CommonUtils } from "@/utils";
import { AppConstant } from "@/const";
import { SupportedChainEnum } from "@/models";
import { Wallet } from "@solana/wallet-adapter-react";
import { AuthContextInterface } from "@/models/context.model";

import useAuthHook from "@/hooks/auth-hooks";
import useBalances from "@/hooks/blockchain-hooks/useBalance";
import useSolanaAuthHooks from "@/hooks/auth-hooks/solana-auth-hooks";

import Cookies from "js-cookie";

const INITIAL_STATE = {} as AuthContextInterface;

const AuthContext = React.createContext(INITIAL_STATE);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const token = Cookies.get(AppConstant.KEY_TOKEN);

  const { handleGetEdasBalance } = useBalances();
  const { activeNetwork, selectedChain } =
    useAppContext();
  const { handleLogout } = useAuthHook();
  const { handleGetSolanaAddress } = useSolanaAuthHooks();

  const [selectChainConnect, setSelectChainConnect] =
    useState<SupportedChainEnum>(SupportedChainEnum.Solana);

  const [accountAddresses, setAccountAddresses] = useState<
    Map<SupportedChainEnum, string>
  >(Map());

  const [edasBalance, setEdasBalance] = useState<
    Map<SupportedChainEnum, number>
  >(Map());

  const handleDisconnect = async (chain?: SupportedChainEnum) => {
    let currentChain;
    if (chain) {
      currentChain = chain;
    } else {
      currentChain = selectedChain;
    }
    if (!currentChain) return;

    await handleLogout(currentChain);

    setAccountAddresses(accountAddresses.set(currentChain, ""));
  };

  const handleDisconnectAll = async () => {
    for (const network of activeNetwork) {
      await handleLogout(network);

      setAccountAddresses(Map());
    }
  };

  const handleLoginSol = async (
    selectedChain: SupportedChainEnum,
    wallet: Wallet
  ) => {
    const address = await handleGetSolanaAddress(wallet);

    if (address) {
      setAccountAddresses(accountAddresses.set(selectedChain, address));
      let addressKey = "";
      let appKey = "";
      switch (selectedChain) {
        case SupportedChainEnum.Solana:
          addressKey = AppConstant.KEY_SOL_WALLET_ADDRESS;
          appKey = AppConstant.KEY_SOL_WALLET_APP;
          break;
        case SupportedChainEnum.Eclipse:
          addressKey = AppConstant.KEY_ECLIPSE_WALLET_ADDRESS;
          appKey = AppConstant.KEY_ECLIPSE_WALLET_APP;
          break;
        case SupportedChainEnum.Soon:
          addressKey = AppConstant.KEY_SOON_WALLET_ADDRESS;
          appKey = AppConstant.KEY_SOON_WALLET_APP;
          break;
      }
      if (addressKey) {
        localStorage.setItem(addressKey, address);
        localStorage.setItem(appKey, wallet.adapter.name);
      }

      return address;
    }
  };

  const handleReconnect = async () => {
    let newAddresses = Map(accountAddresses);

    for (const network of activeNetwork) {
      const { storageWalletAddress } =
        CommonUtils.getStorageAddressByChain(network);

      if (!storageWalletAddress) {
        await handleDisconnect(network);
      } else {
        newAddresses = newAddresses.set(network, storageWalletAddress);
      }
    }

    setAccountAddresses(newAddresses);
  };

  const handleEdasBalance = async () => {
    const address = accountAddresses.get(SupportedChainEnum.Solana);

    if (!address) return;

    const balance = await handleGetEdasBalance(
      SupportedChainEnum.Solana,
      address
    );

    setEdasBalance(edasBalance.set(SupportedChainEnum.Solana, balance || 0));
  };

  useEffect(() => {
    if (!accountAddresses?.size) return;
    handleEdasBalance();
  }, [accountAddresses]);

  useEffect(() => {
    if (!activeNetwork.length) return;
    handleReconnect();
  }, [activeNetwork]);

  return (
    <AuthContext.Provider
      value={{
        edasBalance,
        accountAddresses,
        selectChainConnect,
        setSelectChainConnect,
        handleLoginSol,
        handleDisconnect,
        handleDisconnectAll,
        handleEdasBalance,
        setAccountAddresses,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface AuthProviderProps {
  children: React.ReactNode;
}
