import {
  AssetInterface,
  ExploreInterface,
  SupportTokenType,
  UserInfoInterface,
  SupportedChainEnum,
  PriceFeedInterface,
  LeaderBoardInterface,
  EdasAirdropInterface,
  AirdropStatusInterface,
  AgentsResponseInterface,
  AirdropEligibleInterface,
  ElanderEligibleInterface,
} from ".";
import { Map } from "immutable";
import { Dispatch, SetStateAction } from "react";
import {
  PoolInfoResponseInterface,
  PositionResponseInterface,
  SuggestionsResponseInterface,
} from "./home.model";

interface AppContextProps {
  userInfo: UserInfoInterface;
  setUserInfo: Dispatch<SetStateAction<UserInfoInterface>>;
  leaderBoardData: LeaderBoardInterface[];
  exploreData: ExploreInterface[];

  selectedChain: SupportedChainEnum;
  setSelectedChain: Dispatch<SetStateAction<SupportedChainEnum>>;

  activeNetwork: SupportedChainEnum[];

  isOpenListWalletDialog: boolean;
  setIsOpenListWalletDialog: React.Dispatch<SetStateAction<boolean>>;
  isSelectWalletConnect: boolean;
  setIsSelectWalletConnect: React.Dispatch<SetStateAction<boolean>>;

  pythTokenPriceFeeds: Map<
    SupportedChainEnum,
    Map<SupportTokenType, PriceFeedInterface>
  >;

  isOpenSignInDialog: boolean;
  setIsOpenSignInDialog: Dispatch<SetStateAction<boolean>>;

  chainConnectWallet: SupportedChainEnum | undefined;
  setChainConnectWallet: Dispatch<
    SetStateAction<SupportedChainEnum | undefined>
  >;
  availableAssets: Map<
    SupportedChainEnum,
    Map<SupportTokenType, AssetInterface>
  >;

  isOpenDrawerAccountSetting: boolean;
  setIsOpenDrawerAccountSetting: Dispatch<SetStateAction<boolean>>;

  elanderEligible: ElanderEligibleInterface;
  handleElanderEligible: () => Promise<void>;
}

interface AuthContextInterface {
  edasBalance: Map<SupportedChainEnum, number>;
  accountAddresses: Map<SupportedChainEnum, string>;
  selectChainConnect: SupportedChainEnum;

  setSelectChainConnect: React.Dispatch<SetStateAction<SupportedChainEnum>>;
  handleLoginSol: (
    chain: SupportedChainEnum,
    wallet: any
  ) => Promise<string | undefined>;
  handleDisconnect: (chain?: SupportedChainEnum) => void;
  handleDisconnectAll: () => void;
  handleEdasBalance: () => Promise<void>;
  setAccountAddresses: React.Dispatch<
    SetStateAction<Map<SupportedChainEnum, string>>
  >;
}

interface HomeContextInterface {
  totalClaimedAirdrop: number;
  airdropStatus: AirdropStatusInterface;
  edasAirdropData: EdasAirdropInterface;
  airdropEligible: AirdropEligibleInterface;

  setAirdropEligible: React.Dispatch<SetStateAction<AirdropEligibleInterface>>;
  setAirdropStatus: React.Dispatch<SetStateAction<AirdropStatusInterface>>;
  handleEdasAirdrop: () => Promise<void>;
  handleAirdropEligible: (walletAddress: string) => Promise<void>;
  handleAirdropStatus: (walletAddress: string) => Promise<void>;
}

enum ChatRoleEnum {
  User = "User",
  Agent = "Agent",
}
type ChatMessageInterface = {
  isTyping: boolean;
  role: ChatRoleEnum;
  content: string;
  poolInfos?: PoolInfoResponseInterface[];
  suggestions?: SuggestionsResponseInterface[];
  positions?: PositionResponseInterface[];
};

interface AgentsChatContentInterface extends ExploreInterface {
  chats: ChatMessageInterface[];
}

interface AgentChatBotContextInterface {
  selectedAgent?: ExploreInterface;
  setSelectedAgent: React.Dispatch<
    SetStateAction<ExploreInterface | undefined>
  >;

  agentChatList?: ExploreInterface[];
  setAgentChatList: React.Dispatch<
    SetStateAction<ExploreInterface[] | undefined>
  >;

  agentsChatContent?: AgentsChatContentInterface[];
  setAgentChatContent: React.Dispatch<
    SetStateAction<AgentsChatContentInterface[] | undefined>
  >;

  remainingCredits: number;
  setRemainingCredits: React.Dispatch<SetStateAction<number>>;

  isRunAnimation: boolean;
  setIsRunAnimation: React.Dispatch<SetStateAction<boolean>>;

  message: string;
  setMessage: React.Dispatch<SetStateAction<string>>;

  agentChatIds?: AgentsResponseInterface[];
  currentAgentChatContent?: AgentsChatContentInterface;

  selectedAgentChatId?: AgentsResponseInterface;
  userId?: string;

  handleSubmitMessage: (
    message: string,
    suggestions?: SuggestionsResponseInterface
  ) => void;

  handleGetIntroSocket: () => void;
  handleSendIntroSocket: (data: MessageData) => void;

  isSubmitting: boolean;
}

export interface MessageData {
  agentType: string;
  agentId: string;
  userId: string;
  message: string;
  network: SupportedChainEnum;
}

export { ChatRoleEnum };

export type {
  AppContextProps,
  HomeContextInterface,
  AuthContextInterface,
  AgentsChatContentInterface,
  AgentChatBotContextInterface,
};
