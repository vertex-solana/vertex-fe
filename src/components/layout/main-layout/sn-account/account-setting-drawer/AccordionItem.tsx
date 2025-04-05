"use client";

import React, { useState, ComponentPropsWithoutRef, Fragment } from "react";

import { twJoin, twMerge } from "tailwind-merge";
import { ArrowIcon } from "@/components/icons";

const AccordionItem: React.FC<AccordionItemProps> = ({
  label,
  children,
  className,
  ...otherProps
}) => {
  const [isExpand, setIsExpand] = useState(true);

  return (
    <div
      className={twMerge(
        "p-4",
        "flex flex-col gap-5",
        "rounded-lg bg-white/10",
        className
      )}
      {...otherProps}
    >
      <button
        className={twJoin("w-full flex items-center justify-between")}
        onClick={() => setIsExpand(!isExpand)}
      >
        <p className="font-semibold">{label}</p>

        <ArrowIcon
          className={twJoin("text-neutral5", isExpand && "rotate-180")}
        />
      </button>

      {isExpand ? children : <Fragment />}
    </div>
  );
};

export default AccordionItem;

interface AccordionItemProps extends ComponentPropsWithoutRef<"div"> {
  label: string;
}
