"use client";

import React, { ComponentPropsWithoutRef, FC } from "react";
import { twMerge } from "tailwind-merge";

import Banner from "./Banner";

const Intro: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...otherProps
}) => {
  return (
    <div
      className={twMerge(
        "sm:mt-6",
        "grid grid-cols-1 sm:grid-cols-[58%_40%] gap-x-[22px]"
      )}
      {...otherProps}
    >
      <Banner />
    </div>
  );
};

export default Intro;
