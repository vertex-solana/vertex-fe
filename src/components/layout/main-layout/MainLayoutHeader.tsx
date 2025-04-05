"use client";

import React, { Fragment } from "react";

import { ImageAssets } from "public";
import { twJoin } from "tailwind-merge";
import { useWindowSize } from "@/hooks";
import { AppConstant, PathConstant } from "@/const";
import { DesktopNavigation, NavigationDrawer } from "./navigation";

import Link from "next/link";
import Image from "next/image";
import AccountButton from "./account-button";

const MainLayoutHeader = () => {
  const { windowWidth } = useWindowSize();

  return (
    <div
      className={twJoin(
        "bg-[#0f190f]",
        "h-[60px] w-full",
        "fixed z-50 top-0",
        "border-b border-b-[#D387FF]/10"
      )}
    >
      <div
        className={twJoin(
          "h-[60px]",
          "center-vertical-root",
          "w-full lg:max-w-[1156px]",
          "py-3 px-4 sm:px-6 lg:px-0 mx-auto"
        )}
      >
        <div className={twJoin("w-full", "space-between-root")}>
          <div className="flex items-center">
            {windowWidth > AppConstant.BREAK_POINTS.sm ? (
              <Link
                href={PathConstant.ROOT}
                className="flex items-center gap-x-2"
              >

              </Link>
            ) : (
              <div className="flex items-center gap-x-1">
                <NavigationDrawer />
              </div>
            )}

            {windowWidth >= AppConstant.BREAK_POINTS.lg ? (
              <DesktopNavigation />
            ) : (
              <Fragment />
            )}
          </div>

          <AccountButton />
        </div>
      </div>

    </div>
  );
};

export default MainLayoutHeader;
