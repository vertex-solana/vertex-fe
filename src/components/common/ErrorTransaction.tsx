"use client";

import React, { ComponentPropsWithoutRef, FC, useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import CommonTooltip, { CommonTooltipVariantEnum } from "./common-tooltip";

const ErrorTransaction: FC<ErrorTransactionProps> = ({
  className,
  errorMessage,
  ...otherProps
}) => {
  const [isShowTooltip, setIsShowTooltip] = useState(false);

  return (
    <CommonTooltip
      variant={CommonTooltipVariantEnum.Text}
      isOpen={isShowTooltip}
      contentProps={{
        className: "w-fit bg-white",
        sideOffset: 5,
        onPointerDownOutside: () => setIsShowTooltip(false),
        align: "center",
      }}
      arrowProps={{ className: "fill-white" }}
      trigger={
        <button
          className={twMerge(
            "w-full",
            "mt-2 px-4",
            "text-warning2 text-center",
            "flex items-start justify-center",
            className
          )}
          {...otherProps}
          onClick={() => setIsShowTooltip(!isShowTooltip)}
        >
          <p className="line-clamp-2">{errorMessage}</p>
        </button>
      }
    >
      <span
        className={twJoin(
          "text-center text-sm break-words text-characterBackground2"
        )}
      >
        {errorMessage}
      </span>
    </CommonTooltip>
  );
};

export default ErrorTransaction;

interface ErrorTransactionProps extends ComponentPropsWithoutRef<"button"> {
  errorMessage: string;
}
