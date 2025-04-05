"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { Root, TabsProps } from "@radix-ui/react-tabs";

const TabsRoot: React.FC<TabsProps> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <Root className={twMerge("flex flex-col", className)} {...otherProps}>
      {children}
    </Root>
  );
};

export default TabsRoot;
