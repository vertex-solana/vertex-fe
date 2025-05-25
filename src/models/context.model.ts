import { UserInfoInterface } from ".";
import { Dispatch, SetStateAction } from "react";
import { IndexerResponse, LoginWalletDataInterface } from "./app.model";

interface AppContextProps {
  userInfo: UserInfoInterface | null;
  setUserInfo: Dispatch<SetStateAction<UserInfoInterface | null>>;

  isOpenSignInDialog: boolean;
  setIsOpenSignInDialog: Dispatch<SetStateAction<boolean>>;

  indexer: IndexerResponse | null;
  setIndexer: Dispatch<SetStateAction<IndexerResponse | null>>;

  isOpenDrawerAccountSetting: boolean;
  setIsOpenDrawerAccountSetting: Dispatch<SetStateAction<boolean>>;
}

interface AuthContextInterface {
  walletConnect: string | null;
  setWalletConnect: React.Dispatch<SetStateAction<string | null>>;

  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<SetStateAction<boolean>>;
  
  handleLoginWallet: (input: LoginWalletDataInterface) => Promise<string>;
  handleLogout: () => Promise<void>;
}

interface HomeContextInterface {}

export type { AppContextProps, HomeContextInterface, AuthContextInterface };
