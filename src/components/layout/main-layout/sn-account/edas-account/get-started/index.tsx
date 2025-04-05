"use client";

import React, { FC, Fragment, useEffect, useState } from "react";
import {
  GetStartedStatusEnum,
  DisplayAccountPortfolioInterface,
} from "@/models";
import { useAccountContext } from "@/context";
import { useTranslation } from "react-i18next";
import { TurboTapIcon } from "@/components/icons";
import { ButtonLinear } from "@/components/common";
import { AppConstant, LangConstant, PathConstant } from "@/const";

import AccordionItem from "./AccordionItem";
import HeaderHighlight from "../HeaderHighlight";
import WrapperCard from "@/components/sn-dao/WrapperCard";

const GetStarted: FC<GetStartedProps> = ({
  yourSupplied,
  accountPortfolioDetail,
  onHideGetStarted,
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);
  const { stepStatusGetStarted, setStepStatusGetStarted, lendingVolume } = useAccountContext();

  const [selectedStep, setSelectedStep] = useState(1);

  const handleClickLearnAboutEdas = () => {
    const stepData = {
      ...stepStatusGetStarted,
      step1: GetStartedStatusEnum.SUCCESS,
      step2: GetStartedStatusEnum.PROCESSING,
    };

    window.open(PathConstant.LEARN_ABOUT_EDAS, "_blank");
    if (stepStatusGetStarted.step1 === GetStartedStatusEnum.SUCCESS) return;

    localStorage.setItem(
      AppConstant.KEY_STEP_STATUS_STARTED_ACCOUNT,
      JSON.stringify(stepData)
    );
    setStepStatusGetStarted(stepData);
    setSelectedStep(2);
  };

  const handleClickLearnAboutAgents = () => {
    const stepData = {
      ...stepStatusGetStarted,
      step1: GetStartedStatusEnum.SUCCESS,
      step2: GetStartedStatusEnum.SUCCESS,
      step3: GetStartedStatusEnum.PROCESSING,
    };

    window.open(PathConstant.LEARN_ABOUT_AGENTS, "_blank");
    if (stepStatusGetStarted.step2 === GetStartedStatusEnum.SUCCESS) return;

    localStorage.setItem(
      AppConstant.KEY_STEP_STATUS_STARTED_ACCOUNT,
      JSON.stringify(stepData)
    );
    setStepStatusGetStarted(stepData);
    setSelectedStep(3);
  };

  useEffect(() => {
    const { custodialWallet, userPositions } = accountPortfolioDetail;
    const hasBalance = Boolean(custodialWallet?.balance);
    const hasPositions = userPositions?.length > 0;

    if (hasBalance) {
      const newStepStatus = {
        ...stepStatusGetStarted,
        step1: GetStartedStatusEnum.SUCCESS,
        step2: GetStartedStatusEnum.SUCCESS,
        step3: GetStartedStatusEnum.SUCCESS,
        step4: hasPositions
          ? GetStartedStatusEnum.SUCCESS
          : GetStartedStatusEnum.PROCESSING,
      };

      setStepStatusGetStarted(newStepStatus);
      setSelectedStep(4);
    }

    if (hasPositions) {
      const newStepStatus = {
        ...stepStatusGetStarted,
        step1: GetStartedStatusEnum.SUCCESS,
        step2: GetStartedStatusEnum.SUCCESS,
        step3: GetStartedStatusEnum.SUCCESS,
        step4: GetStartedStatusEnum.SUCCESS,
        step5: GetStartedStatusEnum.PROCESSING,
      };

      setStepStatusGetStarted(newStepStatus);
      setSelectedStep(5);
    }

    if ((yourSupplied + lendingVolume) >= AppConstant.TURBO_TAP_SUPPLY) {
      const newStepStatus = {
        ...stepStatusGetStarted,
        step1: GetStartedStatusEnum.SUCCESS,
        step2: GetStartedStatusEnum.SUCCESS,
        step3: GetStartedStatusEnum.SUCCESS,
        step4: GetStartedStatusEnum.SUCCESS,
        step5: GetStartedStatusEnum.SUCCESS,
      };

      setStepStatusGetStarted(newStepStatus);
      setSelectedStep(5);
    }
  }, [accountPortfolioDetail, yourSupplied, lendingVolume]);

  useEffect(() => {
    const dataStorage =
      localStorage.getItem(AppConstant.KEY_STEP_STATUS_STARTED_ACCOUNT) || "";

    if (dataStorage) {
      const parseData = JSON.parse(dataStorage);

      const entries = Object.entries(parseData);
      const reversedIndex = entries
        .slice()
        .reverse()
        .findIndex(([, status]) => status === GetStartedStatusEnum.SUCCESS);

      const index = reversedIndex === -1 ? 1 : entries.length - reversedIndex;

      setSelectedStep(index + 1);
    }
  }, []);

  return (
    <WrapperCard className="sm:p-4 flex flex-col gap-y-3 ">
      <HeaderHighlight
        className="justify-center sm:justify-start"
        label={
          <p className="text-xl sm:text-sm">{getAccountLabel("lGetStarted")}</p>
        }
      />

      <div className="flex flex-col gap-y-2.5">
        <AccordionItem
          isExpand={selectedStep === 1}
          label="Learn about EDAS"
          step={1}
          status={stepStatusGetStarted.step1}
          onExpand={() => setSelectedStep(1)}
        >
          {selectedStep === 1 && (
            <ButtonLinear
              wrapperClassName="absolute top-0 right-0 "
              className="p-1 text-xs"
              onClick={handleClickLearnAboutEdas}
            >
              {getAccountLabel("lLearnMore")}
            </ButtonLinear>
          )}
          <span className="flex flex-col gap-y-6">
            <p>
              EDAS is a group of DeFAI Agents that help users earn the best
              returns with little effort. Each Agent works like a smart fund
              manager, making investment decisions and generating profits on its
              own.
            </p>

            <p>
              The purpose of the EDAS Account is to allow Agents to execute
              transactions on behalf of users, optimizing their funds across
              DeFi protocols for the best return
            </p>
          </span>
        </AccordionItem>

        <AccordionItem
          isExpand={selectedStep === 2}
          label="Learn about Colossal"
          step={2}
          status={stepStatusGetStarted.step2}
          onExpand={() => setSelectedStep(2)}
        >
          {selectedStep === 2 && (
            <ButtonLinear
              wrapperClassName="absolute top-0 right-0 "
              className="p-1 text-xs"
              onClick={handleClickLearnAboutAgents}
            >
              {getAccountLabel("lLearnMore")}
            </ButtonLinear>
          )}
          <span className="flex flex-col gap-y-6">
            <p>
              Colossal helps you find the best LP pools and provide liquidity on
              DEXs. You can choose a strategy that fits your style: Automated,
              Self-Picked, or LP Leverage.
            </p>

            <p>
              No matter which strategy you pick, DeFAI Agents will handle the
              hard work including monitoring positions and making transactions
              to optimize returns. This includes creating LP positions,
              rebalancing, compounding fees, and reallocating funds when needed
            </p>
          </span>
        </AccordionItem>

        <AccordionItem
          isExpand={selectedStep === 3}
          label="Deposit to EDAS Account"
          step={3}
          status={stepStatusGetStarted.step3}
          onExpand={() => setSelectedStep(3)}
        >
          <span className="flex flex-col gap-y-6">
            <p>
              To start to optimize fund with Colossal, you need to deposit to
              EDAS Account first
            </p>

            <p>Click the highlighted button to proceed</p>
          </span>
        </AccordionItem>

        <AccordionItem
          isExpand={selectedStep === 4}
          label="Supply to Automated Strategy"
          step={4}
          status={stepStatusGetStarted.step4}
          onExpand={() => setSelectedStep(4)}
        >
          <span className="flex flex-col gap-y-6">
            <p>
              With the Automated Strategy, Colossal selects the best LP strategy
              and manages everything for you. It takes care of rebalancing,
              compounding fees, and reallocating funds—so you don’t have to
              spend effort to monitor your positions.
            </p>

            <p>Click the highlighted button to proceed</p>
          </span>
        </AccordionItem>

        <AccordionItem
          isExpand={selectedStep === 5}
          label={
            <span className="flex items-center gap-x-1">
              Earn 10% boost on Turbo Tap
              <TurboTapIcon className="w-6 h-6" />
            </span>
          }
          step={5}
          status={stepStatusGetStarted.step5}
          onExpand={() => setSelectedStep(5)}
        >
          <span className="flex flex-col gap-y-6">
            <p>Supply $1000 in liquidity to Colossal or EnsoFi dapp ( or BOTH) to unlock 10% boost on Turbo Tap</p>
          </span>
        </AccordionItem>
      </div>

      {accountPortfolioDetail &&
      accountPortfolioDetail?.custodialWallet?.balance > 0 &&
      accountPortfolioDetail?.userPositions?.length > 0 ? (
        <button
          className="text-xs text-white/70 mt-auto mx-auto"
          onClick={onHideGetStarted}
        >
          Hide
        </button>
      ) : (
        <Fragment />
      )}
    </WrapperCard>
  );
};

export default GetStarted;

interface GetStartedProps {
  yourSupplied: number;
  accountPortfolioDetail: DisplayAccountPortfolioInterface;
  onHideGetStarted: () => void;
}
