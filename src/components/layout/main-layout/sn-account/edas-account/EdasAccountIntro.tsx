"use client";

import React from "react";

import { useTranslation } from "react-i18next";
import { LangConstant, PathConstant } from "@/const";

const EdasAccountIntro = () => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  return (
    <div className="flex flex-col gap-y-2 sm:gap-y-5 max-w-[690px]">
      <h2 className="font-whiteRabbit sm:text-[42px] sm:leading-[42px]">
        {getAccountLabel("lEdasAccount")}
      </h2>
      <span className="text-xs sm:text-sm font-medium">
        {getAccountLabel("msgAccountDesc")}{" "}
        <a
          className="text-primary4 hover:underline"
          target="_blank"
          href={PathConstant.EDAS_ACCOUNT_DOCS}
        >
          {getAccountLabel("lLearnMore")}
        </a>
      </span>
    </div>
  );
};

export default EdasAccountIntro;
