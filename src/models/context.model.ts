import { UserInfoInterface } from ".";
import { Dispatch, SetStateAction } from "react";
import { IndexerResponse } from "./app.model";

interface AppContextProps {
  userInfo: UserInfoInterface | null;
  setUserInfo: Dispatch<SetStateAction<UserInfoInterface | null>>;

  indexer: IndexerResponse | null;
  setIndexer: Dispatch<SetStateAction<IndexerResponse | null>>;

  isOpenSignInDialog: boolean;
  setIsOpenSignInDialog: Dispatch<SetStateAction<boolean>>;

  isOpenDrawerAccountSetting: boolean;
  setIsOpenDrawerAccountSetting: Dispatch<SetStateAction<boolean>>;
}

interface AuthContextInterface {}

interface HomeContextInterface {}

export type { AppContextProps, HomeContextInterface, AuthContextInterface };
