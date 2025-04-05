"use client";

import React, { ComponentPropsWithoutRef, FC, useMemo } from "react";
import { ImageAssets } from "public";
import { FormatUtils } from "@/utils";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { AppConstant, LangConstant } from "@/const";
import { CheckRoundedIcon } from "@/components/icons";
import Image from "next/image";
import { useAccountContext, useAgentChatBotContext, useAppContext } from "@/context";
import { SupportedChainEnum } from "@/models";

const ProgressTurboTap: FC<ProgressTurboTapProps> = ({
  className,
  yourSupplied,
  ...otherProps
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);
  const { exploreData } = useAppContext();
  const { lendingVolume } = useAccountContext();
  
  const agent = useMemo(() => {
    return exploreData.find((item) => item.network === SupportedChainEnum.Eclipse);
  }, [exploreData]);

  return (
 <div
  className={twMerge('flex flex-col gap-y-5', 'text-xs', className)}
  {...otherProps}
 >
  <Image
   src={ImageAssets.TurboTapTextLogoImage}
   alt=""
   className="w-[105px] h-6"
  />

			<p className="font-inter font-normal text-xs text-neutral5 max-w-60">
				{getAccountLabel('fmSupply', { agent: agent?.name })}
			</p>

			<div className="flex flex-col gap-y-3">
				<p>
					{`${getAccountLabel('lSupplied')} $${FormatUtils.formatNumber(
						yourSupplied + lendingVolume,
						4
					)} / $${FormatUtils.formatNumber(AppConstant.TURBO_TAP_SUPPLY, 4)}`}
				</p>
				<div className={twJoin('w-full h-[6px]', 'rounded-3xl', 'bg-white/10')}>
					<div
						className="bg-brandColorTertiary rounded-3xl h-full"
						style={{
							width: `${
								((yourSupplied + lendingVolume) /
									AppConstant.TURBO_TAP_SUPPLY) *
								100
							}% `,
						}}
					/>
				</div>
				<div className="flex items-center space-x-2">
					<p className="font-inter font-normal text-xs text-neutral5">
						{getAccountLabel('fnInAgent', { agent: agent?.name })}
					</p>
					<p className="font-inter font-normal text-xs text-neutral5">
						{`$${FormatUtils.formatNumber(yourSupplied, 4)}`}
					</p>
				</div>
				<div className="flex items-center space-x-2">
					<p className="font-inter font-normal text-xs text-neutral5">
						{getAccountLabel('lInEnsofi')}
					</p>
					<p className="font-inter font-normal text-xs text-neutral5">
						${lendingVolume}
					</p>
				</div>
			</div>

			<div className="flex flex-col gap-y-2">
				<p>{getAccountLabel('lReward')}</p>

				<div
					className={twJoin(
						'w-full flex items-center justify-between',
						(yourSupplied + lendingVolume) >= AppConstant.TURBO_TAP_SUPPLY
							? 'text-success1'
							: 'text-neutral5'
					)}
				>
					<p>{getAccountLabel('msgBoostTurboTap')}</p>
					<CheckRoundedIcon className={twJoin('w-4 h-4')} />
				</div>

				<p className="font-inter font-normal text-xs text-neutral5 mt-2 max-w-72">
					{getAccountLabel('fmPleaseConnectAgent', { agent: agent?.name })}
				</p>
			</div>
		</div>
	);
};

export default ProgressTurboTap;

interface ProgressTurboTapProps extends ComponentPropsWithoutRef<"div"> {
  yourSupplied: number;
}
