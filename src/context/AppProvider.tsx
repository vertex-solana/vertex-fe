"use client";

import React, {
  FC,
  useState,
  ReactNode,
  useContext,
  createContext,
} from "react";

import { UserInfoInterface } from "@/models";

import { AppContextProps } from "@/models/context.model";
import { IndexerResponse } from "@/models/app.model";

const INITIAL_STATE = {} as AppContextProps;

const AppContext = createContext(INITIAL_STATE);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: FC<AppProviderProps> = ({ children }) => {
  const [isOpenSignInDialog, setIsOpenSignInDialog] = useState(false);
  const [isOpenDrawerAccountSetting, setIsOpenDrawerAccountSetting] =
    useState(false);

  const [userInfo, setUserInfo] = useState<UserInfoInterface | null>(null);
  const [indexer, setIndexer] = useState<IndexerResponse | null>(null);

  return (
    <AppContext.Provider
      value={{
        userInfo: userInfo,
        setUserInfo: setUserInfo,
        indexer: indexer,
        setIndexer: setIndexer,

        isOpenSignInDialog,
        setIsOpenSignInDialog,
        isOpenDrawerAccountSetting,
        setIsOpenDrawerAccountSetting,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

interface AppProviderProps {
  children: ReactNode;
}
