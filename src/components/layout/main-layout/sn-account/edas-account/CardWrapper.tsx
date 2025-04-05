"use client";

import React, { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  className,
  contentClassName,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "p-[1px]",
        "rounded-t-2xl",
        "bg-[linear-gradient(180deg,rgba(255,255,255,0.15)_-14.2%,rgba(255,255,255,0)_115.34%)]",
        className
      )}
      {...otherProps}
    >
      <div
        className={twMerge(
          "p-4 md:p-6",
          "rounded-t-2xl",
          "bg-[#010905] w-full h-full",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default CardWrapper;

interface CardWrapperProps extends ComponentPropsWithoutRef<"div"> {
  contentClassName?: string;
}
