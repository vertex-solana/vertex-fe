"use client";

import React, { ComponentPropsWithoutRef, ReactNode, useMemo } from "react";

import { twJoin, twMerge } from "tailwind-merge";
import { CheckRoundedIcon } from "@/components/icons";
import { GetStartedStatusEnum } from "@/models";

const AccordionItem: React.FC<AccordionItemProps> = ({
  step,
  label,
  status,
  isExpand,
  children,
  onExpand,
  className,
  ...otherProps
}) => {
  const icon = useMemo(() => {
    if (status === GetStartedStatusEnum.SUCCESS) {
      return <CheckRoundedIcon className="w-5 h-5 text-success1" />;
    }

    if (status === GetStartedStatusEnum.PROCESSING) {
      return (
        <div
          className={twJoin(
            "center-root",
            "text-xs text-center",
            "w-5 h-5 rounded-full",
            "bg-primary4 border-[0.5px] border-white/50"
          )}
        >
          {step}
        </div>
      );
    }

    return (
      <div
        className={twJoin(
          "center-root",
          "text-xs text-center",
          "w-5 h-5 rounded-full",
          "bg-white/10 border-[0.5px] border-white/50"
        )}
      >
        {step}
      </div>
    );
  }, [status, step]);
  return (
    <div
      className={twMerge(
        "relative",
        "rounded-lg",
        "flex flex-col gap-y-2.5",
        className
      )}
      {...otherProps}
    >
      <button
        className={twJoin(
          "rounded-full p-1",
          "bg-white/10 w-fit",
          "flex items-center gap-x-1"
        )}
        onClick={onExpand}
      >
        {icon}
        <div
          className={twJoin(
            "font-medium text-xs",
            status === GetStartedStatusEnum.PROCESSING && "text-primary4"
          )}
        >
          {label}
        </div>
      </button>

      <div
        className={twJoin(
          "flex gap-x-4",
          "pl-4 ml-[14px]",
          "text-xs font-medium",
          "border-l border-white/20"
        )}
      >
        {isExpand ? (
          children
        ) : (
          <div className={twJoin(step === 5 ? "h-0" : "h-4")} />
        )}
      </div>
    </div>
  );
};

export default AccordionItem;

interface AccordionItemProps extends ComponentPropsWithoutRef<"div"> {
  step: number;
  status: GetStartedStatusEnum;
  label: ReactNode;
  isExpand: boolean;
  onExpand: () => void;
}
