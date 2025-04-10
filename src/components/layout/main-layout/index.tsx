"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";

import Header from "../header";
import Footer from "../footer";

const MainLayout: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div className="min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
