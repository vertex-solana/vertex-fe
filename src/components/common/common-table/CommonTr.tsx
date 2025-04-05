"use client";

import React, { ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

const CommonTr: React.FC<ComponentPropsWithoutRef<"tr">> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <tr
      className={twMerge(
        "w-full",
        "relative",
        "hover:bg-[#294b86]/20",
        className
      )}
      {...otherProps}
    >
      {children}
    </tr>
  );
};

export default CommonTr;
