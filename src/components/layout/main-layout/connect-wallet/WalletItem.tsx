"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import Image, { StaticImageData } from "next/image";

const WalletItem: React.FC<WalletItemProps> = ({
  title,
  imgSrc,
  isBackPack,
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();

  return (
    <button
      className={twMerge(
        "px-4 py-2",
        "rounded-lg",
        "flex flex-row justify-between items-center gap-x-2",
        "text-sm text-neutral1 font-medium",
        "border border-characterBackground2",
        "bg-characterBackground2 hover:bg-characterBackground3",
        className
      )}
      {...otherProps}
    >
      <div className="flex flex-row gap-x-4 items-center">
        <Image width={40} height={40} src={imgSrc} alt={title} />
        <span>{title}</span>
      </div>
    </button>
  );
};

export default WalletItem;

interface WalletItemProps extends React.ComponentPropsWithoutRef<"button"> {
  imgSrc: string | StaticImageData;
  title: string;
  isBackPack: boolean;
}
