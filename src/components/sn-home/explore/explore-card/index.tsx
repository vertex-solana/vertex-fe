"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";

import { ImageAssets } from "public";
import { twMerge } from "tailwind-merge";
import { ExploreInterface } from "@/models";

import Link from "next/link";
import Image from "next/image";
import HeaderCard from "./HeaderCard";
import FooterCard from "./FooterCard";

const ExploreCard: FC<ExploreCardProps> = ({
  className,
  exploreData,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "p-4",
        "rounded-lg",
        "w-full h-full",
        "flex flex-col",
        "bg-bgExploreCard"
      )}
      {...otherProps}
    >
      <HeaderCard exploreData={exploreData} />

      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col mint-h-[55%] justify-between gap-y-4 py-4 ">
          <p className="text-sm font-medium text-white/40">
            {exploreData.description}
          </p>

          <div className="flex items-center gap-x-2">
            {exploreData.telegram_url && (
              <Link
                href={exploreData.telegram_url}
                target="_blank"
                className="h-[30px] w-[30px]"
              >
              </Link>
            )}
          </div>
        </div>

        <FooterCard exploreData={exploreData} />
      </div>
    </div>
  );
};

export default ExploreCard;

interface ExploreCardProps extends ComponentPropsWithoutRef<"div"> {
  exploreData: ExploreInterface;
}
