"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";
import { CommonUtils } from "@/utils";
import { twJoin, twMerge } from "tailwind-merge";
import { ExploreInterface, ExploreStatusEnum } from "@/models";

import Image from "next/image";

const HeaderCard: FC<HeaderCardProps> = ({
  className,
  exploreData,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge("flex items-center justify-between")}
      {...otherProps}
    >
      <div className="flex items-center gap-x-4">
        <img src={exploreData.image} className="w-[52px] h-[52px] rounded-lg" />

        <span className="flex flex-col font-whiteRabbit">
          <p className="text-xl ">{exploreData?.name}</p>
          <p className="text-sm text-[#737373]">{exploreData?.symbol}</p>
        </span>
      </div>

      <div className="flex items-center gap-x-2">
        <span
          className={twJoin(
            "px-2 py-[5px]",
            "bg-bgLinearWhite",
            "rounded border-[0.5px] border-white/50"
          )}
        >
          <Image
            src={CommonUtils.getChainImageSrcByValue(exploreData?.network)}
            alt=""
            className="w-4 h-4 rounded-full"
          />
        </span>

        <span
          className={twJoin(
            "text-xs",
            "px-2 py-[5px]",
            "rounded border-[0.5px] border-white/50",
            exploreData.status === ExploreStatusEnum.LIVE
              ? "bg-bgGreenLinearButton"
              : exploreData.status === ExploreStatusEnum.CHAT_LIVE
              ? "bg-bgBeta"
              : "bg-bgLinearWhite"
          )}
        >
          {exploreData.status}
        </span>
      </div>
    </div>
  );
};

export default HeaderCard;

interface HeaderCardProps extends ComponentPropsWithoutRef<"div"> {
  exploreData: ExploreInterface;
}
