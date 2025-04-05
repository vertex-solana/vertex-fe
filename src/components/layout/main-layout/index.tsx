"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";

import { PathConstant } from "@/const";
import { useWindowSize } from "@/hooks";
import { usePathname } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";

import MainLayoutFooter from "./MainLayoutFooter";
import MainLayoutHeader from "./MainLayoutHeader";

const MainLayout: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  className,
  ...otherProps
}) => {
  const pathName = usePathname();
  const { windowWidth } = useWindowSize();

  return (
    <div
      className={twMerge(
        "w-screen relative",
        "bg-cover bg-top bg-no-repeat",
        className
      )}
      style={{ backgroundImage: "url('/images/img-home-background.svg" }}
      {...otherProps}
    >
      <MainLayoutHeader />
      <div
        className={twJoin(
          "z-[10]",
          "max-w-full",
          "min-h-screen",
          "overflow-x-hidden",
          "relative flex flex-col",
          "mx-auto pt-[96px] sm:pt-[60px]",
          windowWidth > 1440 ? "pb-[220px]" : "pb-[120px] sm:!pb-[170px]",
          pathName === PathConstant.EDAS_POINT
            ? "lg:max-w-[920px]"
            : "lg:max-w-[1154px]"
        )}
      >
        {children}
        <div className="flex items-center gap-x-2 z-[1000] absolute right-0 bottom-7">
        </div>
      </div>
      <MainLayoutFooter />
    </div>
  );
};

export default MainLayout;
