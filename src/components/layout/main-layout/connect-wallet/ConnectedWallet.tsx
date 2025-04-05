"use client";

import React, { ComponentPropsWithoutRef, FC, useMemo } from "react";
import { CommonUtils } from "@/utils";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import { LoginCircleIcon } from "@/components/icons";
import { useAppContext, useAuthContext } from "@/context";
import { ListWalletConnectRow } from "./ConnectMoreWallet";

const ConnectedWallet: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...otherProps
}) => {
  const { t: getLabel } = useTranslation();
  const { activeNetwork } = useAppContext();
  const { accountAddresses, handleDisconnect, handleDisconnectAll } =
    useAuthContext();

  const listConnectedWallet = useMemo(() => {
    if (!accountAddresses) return [];
    return activeNetwork.filter((item) => accountAddresses.get(item));
  }, [activeNetwork, accountAddresses]);

  return (
    listConnectedWallet.length > 0 && (
      <div
        className={twMerge("flex flex-col gap-y-4", className)}
        {...otherProps}
      >
        <div className="space-between-root">
          <p className="text-sm font-semibold text-neutral5">
            {getLabel("lConnectedWallet")}
          </p>
          {listConnectedWallet.length > 1 && (
            <button
              className="text-sm font-medium text-error2"
              onClick={handleDisconnectAll}
            >
              {getLabel("lDisconnectAll")}
            </button>
          )}
        </div>

        {listConnectedWallet.map((item, index) => (
          <ListWalletConnectRow
            key={index}
            chain={item}
            label={CommonUtils.truncateHash(accountAddresses.get(item), 6)}
          >
            <button onClick={() => handleDisconnect(item)}>
              <LoginCircleIcon className="w-6 h-6 text-error2" />
            </button>
          </ListWalletConnectRow>
        ))}
      </div>
    )
  );
};

export default ConnectedWallet;
