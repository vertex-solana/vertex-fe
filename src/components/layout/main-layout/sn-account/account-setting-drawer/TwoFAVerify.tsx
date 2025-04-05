import React, { useState } from "react";

import { LangConstant } from "@/const";
import { useAuthContext } from "@/context";
import { useTranslation } from "react-i18next";
import { ShieldIcon, TrashIcon } from "@/components/icons";

import AccordionItem from "./AccordionItem";
import Delete2FADialog from "./Delete2FADialog";
import SetupAuthenticatorDialog from "./setup-authenticator-dialog";
import useAuthentication from "@/hooks/account-hooks/useAuthentication";

const TwoFAVerify: React.FC<TwoFAVerifyProps> = ({ onCloseDrawer }) => {
  const { t: getAccountLabel } = useTranslation(LangConstant.NS_ACCOUNT);

  const { accountInfo } = useAuthContext();
  const { handlePostActivate2FA } = useAuthentication();

  const [isOpenSetup, setIsOpenSetup] = useState(false);
  const [isOpenDelete2FA, setIsOpenDelete2FA] = useState(false);

  const [qrAuthUrl, setQrAuthUrl] = useState("");
  const [authenticatorData, setAuthenticatorData] = useState("");

  const handleOpenDelete2FA = () => {
    onCloseDrawer();
    setIsOpenDelete2FA(true);
  };

  const handleOpenSetupDialog = async () => {
    onCloseDrawer();
    setIsOpenSetup(true);

    const activateResponse = await handlePostActivate2FA();

    if (activateResponse?.secret) {
      setQrAuthUrl(activateResponse.otpAuthUrl);
      setAuthenticatorData(activateResponse.secret);
    }
  };

  return (
    <>
      <AccordionItem label={getAccountLabel("l2FAVerify")}>
        <p className="text-[13px] text-neutral4">
          To protect your account, it is recommended to enable 2FA
        </p>

        {accountInfo && accountInfo?.account?.twoFactorEnabled ? (
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral5">Actived</p>

            <button
              className="flex items-center gap-x-1 text-error2"
              onClick={handleOpenDelete2FA}
            >
              <TrashIcon />
              <p className="text-xs">{getAccountLabel("lDelete")}</p>
            </button>
          </div>
        ) : (
          <button
            className="flex items-center gap-x-1 text-primary4 text-[13px] font-medium"
            onClick={handleOpenSetupDialog}
          >
            <ShieldIcon />
            <p>{getAccountLabel("lActive")}</p>
          </button>
        )}
      </AccordionItem>

      {authenticatorData && (
        <SetupAuthenticatorDialog
          isOpen={isOpenSetup}
          qrAuthUrl={qrAuthUrl}
          authenticatorData={authenticatorData}
          onClose={() => setIsOpenSetup(false)}
        />
      )}

      <Delete2FADialog
        isOpen={isOpenDelete2FA}
        onClose={() => setIsOpenDelete2FA(false)}
      />
    </>
  );
};

export default TwoFAVerify;

interface TwoFAVerifyProps {
  onCloseDrawer: () => void;
}
