"use client";

import React, { ComponentPropsWithoutRef } from "react";
import { PathConstant } from "@/const";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";

import Link from "next/link";

const DesktopNavigation = () => {
  const { t: getLabel } = useTranslation();

  return (
    <div className={twJoin("ml-6", "flex items-center")}>
      <DesktopLink href={PathConstant.ROOT}>{getLabel("lHome")}</DesktopLink>
      <DesktopLink href={PathConstant.DAO}>{getLabel("lAgentDao")}</DesktopLink>
      <DesktopLink href={PathConstant.EDAS_ACCOUNT}>
        {getLabel("lEdasAccount")}
      </DesktopLink>
      <DesktopLink href={PathConstant.EDAS_POINT}>
        {getLabel("lEdasPoints")}
      </DesktopLink>
      <DesktopLink href={PathConstant.DOCS} target="_blank">
        {getLabel("lDocs")}
      </DesktopLink>
    </div>
  );
};

export default DesktopNavigation;

export const DesktopLink: React.FC<DesktopLinkProps> = ({
  href,
  children,
  isActive,
  className,
  disabled = false,
  ...otherProps
}) => {
  const pathname = usePathname();

  const active = isActive || pathname === href;

  return (
    <Link
      href={href || "#"}
      className={twMerge(
        "text-sm",
        "py-2 px-6",
        "rounded-lg",
        "font-semibold",
        "hover:text-neutral1",
        "focus-visible:outline-none",
        disabled && "pointer-events-none",
        active ? "text-neutral1" : "text-neutral5",
        className
      )}
      {...otherProps}
    >
      {children}
    </Link>
  );
};

interface DesktopLinkProps extends ComponentPropsWithoutRef<"a"> {
  isActive?: boolean;
  disabled?: boolean;
}
