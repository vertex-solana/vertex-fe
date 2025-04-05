"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";
import { DateUtils } from "@/utils";
import { ImageAssets } from "public";
import { SwiperSlide } from "swiper/react";
import { useRouter } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";
import { AppConstant, PathConstant } from "@/const";
import { useCountdownByTimestamp } from "@/hooks/useCountdown";
import { CommonButton, CommonSwiper } from "@/components/common";
import { CommonButtonVariantEnum } from "@/components/common/common-button";

import Link from "next/link";
import Image from "next/image";

const Banner: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...otherProps
}) => {
  const router = useRouter();

  const time = AppConstant.MINTING_ON_SCOPE_TIME;

  const timeRemaining =
    useCountdownByTimestamp(time, () => {
      return;
    }) || 0;

  return (
    <div className={twMerge("sm:rounded-2xl", className)} {...otherProps}>
      <CommonSwiper
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide>
          <div className="relative bg-white/10 sm:rounded-2xl">

            <div
              className={twJoin(
                "font-jersey text-sm",
                "absolute top-[80%] left-4",
                "flex items-center gap-x-1"
              )}
            >
              <Link
                href={PathConstant.MINTING_SCOPE_LINK}
                className={twJoin(
                  "py-1 px-3",
                  "text-[#1F242F]",
                  "rounded-full bg-white"
                )}
                target="_blank"
              >
                {timeRemaining > 0
                  ? `Minting on Scope in ${DateUtils.convertTimestampToFullFormat(
                      timeRemaining
                    )} `
                  : "Mint Now"}
              </Link>
              <Link
                href={PathConstant.ELANDER_GRASSLAND_LINK}
                className={twJoin(
                  "py-1 px-3 text-sm",
                  "rounded-full border border-white/20"
                )}
                target="_blank"
              >
                View Detail
              </Link>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative bg-white/10 sm:rounded-2xl">

            <div
              className={twJoin(
                "flex items-center gap-x-5",
                "absolute top-[64%] left-4 sm:left-10"
              )}
            >
              <CommonButton
                variant={CommonButtonVariantEnum.Gray}
                className="text-xs px-3 py-2"
                onClick={() => router.push(PathConstant.EDAS_ACCOUNT)}
              >
                Earn with Colossal Now!
              </CommonButton>
            </div>
          </div>
        </SwiperSlide>
      </CommonSwiper>
    </div>
  );
};

export default Banner;
