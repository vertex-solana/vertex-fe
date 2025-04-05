import React, { ComponentPropsWithoutRef, FC } from "react";

import {
  useWallet,
  AnyAptosWallet,
  isInstallRequired,
  groupAndSortWallets,
} from "@aptos-labs/wallet-adapter-react";
import { useAuthContext } from "@/context";
import { SupportedChainEnum } from "@/models";
import { twJoin, twMerge } from "tailwind-merge";

const AptosWalletList: FC<AptosWalletListProps> = ({
  selectChainConnect,
  onClose,
}) => {
  const { wallets = [] } = useWallet();
  const { availableWallets } = groupAndSortWallets(wallets);
  const { handleLoginMovement } = useAuthContext();

  const handleConnect = async (wallet: any) => {
    onClose();

    await handleLoginMovement(selectChainConnect, wallet);
  };

  return (
    <div className={twJoin("w-full", "flex flex-col gap-y-4")}>
      {availableWallets
        .filter((item) => item.name !== "Dev T wallet")
        .map((wallet) => (
          <WalletRow
            key={wallet.name}
            wallet={wallet}
            onClick={() => handleConnect(wallet)}
          />
        ))}
    </div>
  );
};

export default AptosWalletList;

interface AptosWalletListProps {
  selectChainConnect: SupportedChainEnum;
  onClose: () => void;
}

function WalletRow({ wallet, className, ...otherProps }: WalletRowProps) {
  return (
    !isInstallRequired(wallet) && (
      <button
        className={twMerge(
          "px-4 py-2",
          "rounded-lg",
          "text-sm text-neutral1 font-medium",
          "border border-characterBackground2",
          "flex flex-row justify-between items-center gap-x-2",
          "bg-characterBackground2 hover:bg-characterBackground3",
          className
        )}
        {...otherProps}
      >
        <div className="flex flex-row gap-x-4 items-center">
          <img
            width={40}
            height={40}
            src={wallet.icon}
            alt={`${wallet.name} logo`}
            className="rounded-full"
          />
          <span>{wallet.name}</span>
        </div>
      </button>
    )
  );
}

interface WalletRowProps extends ComponentPropsWithoutRef<"button"> {
  wallet: AnyAptosWallet;
}
