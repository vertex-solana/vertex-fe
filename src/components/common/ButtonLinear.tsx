"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";
import { twMerge } from "tailwind-merge";

const ButtonLinear: FC<ButtonLinearProps> = ({
  children,
  disabled,
  className,
  wrapperClassName,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "p-[2px]",
        "rounded-full",
        "bg-bgGreenLinearButton shadow-shadowGreenLinearButton",
        disabled && "opacity-50",
        wrapperClassName
      )}
    >
      <button
        className={twMerge(
          "py-3",
          "bg-white/15",
          "rounded-full",
          "flex items-center justify-center",
          className
        )}
        disabled={disabled}
        {...otherProps}
      >
        {children}
      </button>
    </div>
  );
};

export default ButtonLinear;

export interface ButtonLinearProps extends ComponentPropsWithoutRef<"button"> {
  wrapperClassName?: string;
}
