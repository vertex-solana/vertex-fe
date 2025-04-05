import React, { useMemo } from "react";

import { LangConstant } from "@/const";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { useAgentChatBotContext, useAppContext } from "@/context";
import { TurboTapIcon } from "@/components/icons";

const ChatWithAgentButton: React.FC<ChatWithAgentButtonProps> = ({
  disabled,
  className,
  selectedNetwork,
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);
  const { exploreData } = useAppContext();
  const { agentChatList, setSelectedAgent, setAgentChatList } =
    useAgentChatBotContext();

  const agent = useMemo(() => {
    return exploreData.find((item) => item.network === selectedNetwork);
  }, [exploreData, selectedNetwork]);

  const handleOpenChatBox = () => {
    if (!agent) return;

    setSelectedAgent(agent);
    const isExist = agentChatList?.find((item) => item.id === agent.id);

    if (!isExist) {
      setAgentChatList([...(agentChatList || []), agent]);
    }
  };

  return (
    <button
      className={twMerge(
        "w-fit",
        "rounded-full",
        "px-2.5 py-1.5",
        "text-sm font-semibold",
        "border-[2px] border-white/20",
        "flex items-center gap-x-2 justify-center",
        className
      )}
      disabled={disabled}
      onClick={handleOpenChatBox}
    >
      <span
        className={twJoin(
          "w-fit",
          "shadow-shadowGreenLinearButton",
          "border border-success3 rounded-full"
        )}
      >
        <img src={agent?.image} className="w-8 h-8 rounded-full" />
      </span>
      {getAccountLabel("lChatWithAgent")}
      <TurboTapIcon />
    </button>
  );
};

export default ChatWithAgentButton;

interface ChatWithAgentButtonProps {
  selectedNetwork: SupportedChainEnum;
  className?: string;
  disabled?: boolean;
}
