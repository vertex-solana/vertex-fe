"use client";

import React, { ComponentPropsWithoutRef } from "react";
import { twJoin, twMerge } from "tailwind-merge";

const HeaderHighlight: React.FC<HeaderHighlightProps> = ({
  label,
  className,
  buttonClassName,
  ...otherProps
}) => {
  return (
    <div className="flex flex-col w-full">
      <div
        className={twMerge("flex items-center", "w-full relative", className)}
        {...otherProps}
      >
        <button
          className={twMerge(
            "flex flex-col items-center gap-y-2",
            "text-success1 text-base font-semibold",
            buttonClassName
          )}
        >
          {label}
          <div
            className={twJoin(
              "w-full h-[2px]",
              "bg-[linear-gradient(90deg,rgba(0,255,192,0)_0.61%,#00FFC0_50.58%,rgba(0,255,192,0)_100%)]"
            )}
          />
        </button>
      </div>

      <Divider />
    </div>
  );
};

export default HeaderHighlight;

interface HeaderHighlightProps extends ComponentPropsWithoutRef<"div"> {
  label: React.ReactNode;
  buttonClassName?: string;
}

export const Divider: React.FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "w-full h-[1px]",
        "bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.4)_55.92%,rgba(255,255,255,0)_100%)]",
        className
      )}
      {...otherProps}
    />
  );
};
