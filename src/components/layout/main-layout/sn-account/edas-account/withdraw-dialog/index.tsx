import React, { useEffect, useState } from "react";

import { LangConstant } from "@/const";
import { twJoin } from "tailwind-merge";
import { useAuthContext } from "@/context";
import { SupportedChainEnum } from "@/models";
import { useTranslation } from "react-i18next";
import { CommonDialog } from "@/components/common";

import WrapperCard from "@/components/sn-dao/WrapperCard";
import HeaderHighlight from "../HeaderHighlight";
import WithdrawInput from "./WithdrawInput";
import Enable2FA from "./Enable2FA";
import Verify from "./Verify";

const WithdrawDialog: React.FC<WithdrawDialogProps> = ({
  isOpen,
  selectedNetwork,
  onClose,
  onSetupAuthenticator,
}) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { accountInfo } = useAuthContext();

  const [step, setStep] = useState<WithdrawStepEnum>(WithdrawStepEnum.INPUT);
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState("");

  const handleClose = () => {
    onClose();
    setAmount(0);
    setAddress("");
    setStep(WithdrawStepEnum.INPUT);
  };

  const handleGoToNextStep = () => {
    if (!accountInfo) return;

    if (accountInfo.account?.twoFactorEnabled) {
      setStep(WithdrawStepEnum.VERIFY);
    } else {
      setStep(WithdrawStepEnum.ENABLE_2FA);
    }
  };

  useEffect(() => {
    setStep(WithdrawStepEnum.INPUT);
  }, [isOpen]);

  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={handleClose}
      contentClassName="p-0 rounded-lg sm:max-w-[380px]"
      closeIconClassName="top-2 right-2 z-20"
    >
      <WrapperCard
        className="px-0 sm:px-0 sm:py-4"
        wrapperCardClassName={"sm:min-h-fit"}
      >
        <div className={twJoin("w-full h-full", "flex flex-col gap-y-3")}>
          <HeaderHighlight
            label={<p className="px-4">{getAccountLabel("lWithdraw")}</p>}
            buttonClassName="px-4"
          />
          {step === WithdrawStepEnum.INPUT ? (
            <WithdrawInput
              selectedNetwork={selectedNetwork}
              onGoToNextStep={handleGoToNextStep}
              amount={amount}
              setAmount={setAmount}
              addressValue={address}
              setAddressValue={setAddress}
            />
          ) : step === WithdrawStepEnum.ENABLE_2FA ? (
            <Enable2FA
              onClose={handleClose}
              onSetupAuthenticator={onSetupAuthenticator}
            />
          ) : (
            <Verify
              address={address}
              amount={amount}
              chain={selectedNetwork}
              onClose={handleClose}
            />
          )}
        </div>
      </WrapperCard>
    </CommonDialog>
  );
};

export default WithdrawDialog;

interface WithdrawDialogProps {
  isOpen: boolean;
  selectedNetwork: SupportedChainEnum;
  onClose: () => void;
  onSetupAuthenticator: () => void;
}

export enum WithdrawStepEnum {
  INPUT = "INPUT",
  ENABLE_2FA = "ENABLE_2FA",
  VERIFY = "VERIFY",
}
