"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";

import Header from "../header";
import Footer from "../footer";
import { usePathname } from "next/navigation";
import { twJoin } from "tailwind-merge";

const MainLayout: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  className,
  ...otherProps
}) => {
  const pathName = usePathname();

  return (
    <div className="min-h-screen">
      <Header />

      <div
        className={twJoin(
          "z-[10]",
          "max-w-full",
          "min-h-screen",
          "overflow-x-hidden",
          "mx-auto pt-[76px]",
          "relative flex flex-col",
          pathName !== "/" && "sm:max-w-[1376px]"
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 -z-[1]"></div>
        {children}
      </div>
      {pathName === "/" && <Footer />}
    </div>
  );
};

export default MainLayout;
