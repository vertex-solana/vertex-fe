"use client";

import React, {
  FC,
  useRef,
  useState,
  useEffect,
  ComponentPropsWithoutRef,
} from "react";
import { CommonUtils } from "@/utils";
import { useAppContext } from "@/context";
import { SupportedChainEnum } from "@/models";
import { twJoin, twMerge } from "tailwind-merge";

import Image from "next/image";

const SelectedChainTabs: FC<SelectedChainTabsProps> = ({
  className,
  isDefaultAll = false,
  allowSelectAll = false,

  onSelectAll,
  onSelectChain,

  ...otherProps
}) => {
  const hasInitialized = useRef(false);
  const [selectedChainTabs, setSelectedChainTabs] = useState<
    SupportedChainEnum | undefined
  >(undefined);
  const { selectedChain, setSelectedChain, activeNetwork } = useAppContext();

  const handleSelectChain = (chain: SupportedChainEnum) => {
    setSelectedChain(chain);
    setSelectedChainTabs(chain);
    onSelectChain?.(chain);
  };

  const handleSelectAll = () => {
    onSelectAll?.();
    setSelectedChainTabs(undefined);
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (isDefaultAll) {
        setSelectedChainTabs(undefined);
      } else {
        setSelectedChainTabs(selectedChain);
      }
    }
  }, [isDefaultAll, selectedChain]);

  return (
    <div
      className={twMerge("w-max", "flex items-center gap-x-2", className)}
      {...otherProps}
    >
      {allowSelectAll && (
        <button
          className={twJoin(
            "p-2",
            "rounded-xl border-[0.5px]",
            "flex items-center gap-x-2",
            selectedChainTabs === undefined
              ? "bg-bgSelectChainTabItem border-white/10"
              : "bg-characterBackground3 border-characterBackground3"
          )}
          onClick={handleSelectAll}
        >
          <p className="text-sm font-medium mx-4">All</p>
        </button>
      )}
      {activeNetwork.map((item, index) => (
        <button
          key={index}
          className={twJoin(
            "p-2",
            "rounded-xl border-[0.5px]",
            "flex items-center gap-x-2",
            selectedChainTabs === item
              ? "bg-bgSelectChainTabItem border-white/10"
              : "bg-characterBackground3 border-characterBackground3"
          )}
          onClick={() => handleSelectChain(item)}
        >
          <Image
            src={CommonUtils.getChainImageSrcByValue(item)}
            alt={`${item} logo`}
            className={twJoin(
              "w-6 h-6 rounded-full",
              selectedChainTabs !== item && "grayscale"
            )}
          />
          <p className="text-sm font-medium">
            {
              Object.keys(SupportedChainEnum)[
                Object.values(SupportedChainEnum).indexOf(item)
              ]
            }
          </p>
        </button>
      ))}
    </div>
  );
};

interface SelectedChainTabsProps extends ComponentPropsWithoutRef<"div"> {
  isDefaultAll?: boolean;
  allowSelectAll?: boolean;
  onSelectAll?: () => void;
  onSelectChain?: (chain: SupportedChainEnum) => void;
}

export default SelectedChainTabs;
