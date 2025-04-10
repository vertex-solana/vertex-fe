"use client";

import React, { useState, ComponentPropsWithoutRef } from "react";

import { useWindowSize } from "@/hooks";
// import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { twJoin, twMerge } from "tailwind-merge";
import { HamburgerIcon } from "@/components/icons";
import { AppConstant, PathConstant } from "@/const";

import Link from "next/link";
import Drawer from "react-modern-drawer";

import "react-modern-drawer/dist/index.css";

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ className }) => {
  const { t: getLabel } = useTranslation();

  const { windowWidth } = useWindowSize();

  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button onClick={handleToggleDrawer}>
        <HamburgerIcon
          className={twJoin("mr-2 sm:mr-6", "text-neutral3", "cursor-pointer")}
        />
      </button>

      <Drawer
        open={isOpen}
        onClose={handleToggleDrawer}
        duration={200}
        direction="left"
        overlayOpacity={0}
        size={windowWidth <= AppConstant.BREAK_POINTS.sm ? "100vw" : 200}
        className={twMerge(
          "!top-auto",
          "!bg-characterBackground3",
          "!bottom-0 !h-[calc(100svh-60px)]",
          className
        )}
      >
        <div className={twJoin("h-full flex flex-col justify-between")}>
          <div className={twJoin("gap-y-1", "flex flex-col items-start")}>
            <NavigationItem
              href={PathConstant.ROOT}
              onClick={handleToggleDrawer}
            >
              {getLabel("lHome")}
            </NavigationItem>

            <NavigationItem
              onClick={handleToggleDrawer}
              href={PathConstant.DAO}
            >
              {getLabel("lAgentDao")}
            </NavigationItem>

            <NavigationItem
              onClick={handleToggleDrawer}
              href={PathConstant.EDAS_ACCOUNT}
            >
              {getLabel("lEdasAccount")}
            </NavigationItem>

            <NavigationItem
              onClick={handleToggleDrawer}
              href={PathConstant.EDAS_POINT}
            >
              {getLabel("lEdasPoints")}
            </NavigationItem>

            <NavigationItem
              onClick={handleToggleDrawer}
              href={PathConstant.DOCS}
              target="_blank"
            >
              {getLabel("lDocs")}
            </NavigationItem>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default NavigationDrawer;

interface NavigationDrawerProps {
  className?: string;
}

export const NavigationItem: React.FC<NavigationItemProps> = ({
  href,
  children,
  isActive,
  className,
  disabled = false,
  ...otherProps
}) => {
  // const pathname = usePathname();

  const active = isActive 
    // || pathname === href;

  return (
    <Link
      href={href || "#"}
      className={twMerge(
        "py-3 px-6",
        "w-full h-11",
        "hover:text-neutral1",
        "text-sm font-semibold",
        "flex items-center gap-x-1",
        "focus-visible:outline-none",
        "hover:bg-characterBackground2",
        disabled && "pointer-events-none",
        active
          ? "text-neutral1 bg-characterBackground2"
          : "text-neutral5 bg-transparent",
        className
      )}
      {...otherProps}
    >
      {children}
    </Link>
  );
};

interface NavigationItemProps extends ComponentPropsWithoutRef<"a"> {
  isActive?: boolean;
  disabled?: boolean;
}
