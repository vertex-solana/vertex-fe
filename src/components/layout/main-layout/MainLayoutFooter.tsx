"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";
import { useWindowSize } from "@/hooks";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";

const MainLayoutFooter: FC<MainLayoutFooterProps> = ({
  className,
  wrapperClassName,
  ...otherProps
}) => {
  const { windowWidth } = useWindowSize();
  const { t: getLabel } = useTranslation();

  return (
    <div
      className={twMerge(
        "flex items-end",
        "bg-cover bg-no-repeat",
        "absolute bottom-0 left-1/2 -translate-x-1/2",
        "w-[900px] sm:w-screen h-[223px] sm:h-[353px]",
        windowWidth > 1440 ? "bg-bottom " : "bg-top ",
        wrapperClassName
      )}
      style={{ backgroundImage: "url('/images/img-footer-background.png" }}
    >
      <div
        className={twMerge(
          "overflow-x-hidden",
          "w-screen lg:max-w-[1154px] ",
          "mx-auto mb-3 sm:mb-7 px-4 sm:px-0",
          "flex items-center justify-between",

          className
        )}
        {...otherProps}
      >
      </div>
    </div>
  );
};

export default MainLayoutFooter;

interface MainLayoutFooterProps extends ComponentPropsWithoutRef<"div"> {
  wrapperClassName?: string;
}
