"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";
import { twMerge } from "tailwind-merge";

const CommonTh: FC<CommonThProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <th
      className={twMerge(
        "px-4 py-3",
        "font-inter font-normal",
        "text-sm text-neutral5 text-start",
        "first:rounded-tl-lg last:rounded-tr-lg",
        className
      )}
      {...otherProps}
    >
      {children}
    </th>
  );
};

export default CommonTh;

interface CommonThProps extends ComponentPropsWithoutRef<"th"> {}
