"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";

import { PathConstant } from "@/const";
import { useWindowSize } from "@/hooks";
import { usePathname } from "next/navigation";
import { twJoin, twMerge } from "tailwind-merge";

import MainLayoutFooter from "./MainLayoutFooter";
import MainLayoutHeader from "./MainLayoutHeader";
import Header from "../header";
import Footer from "../footer";

const MainLayout: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  className,
  ...otherProps
}) => {
  const pathName = usePathname();
  const { windowWidth } = useWindowSize();

  return (
    <div className="min-h-screen">
      <Header />
      
      {children}
      
      <Footer />
    </div>
  );
};

export default MainLayout;
