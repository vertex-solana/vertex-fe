import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Modal } from "@/components/ui/Modal";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useAppContext, useAuthContext } from "@/context";
import { BlockchainTransactionStatusEnum, SolanaWalletsEnum } from "@/models";
import { PublicKey } from "@solana/web3.js";
import { seeds } from "@/services/billing-service/sdk";
import { isNil, set } from "lodash";
import useInitUserVaultHooks from "@/hooks/billing-hooks/useInitUserVaultHooks";
import { CommonTransactionToast } from "@/components/common";
import useTransaction from "@/hooks/blockchain-hooks";

const WalletConnect = () => {
  const { wallets, select, publicKey, wallet } = useWallet();

  const {
    handleLoginWallet,
    setWalletConnect,
    setIsLoggedIn,
    isLoggedIn,
    walletConnect,
  } = useAuthContext();
  const { connection, vertexProgram } = useAppContext();
  const {
    handleInitUserVault,
    transactionHash,
    transactionStatus,
    setTransactionHash,
    setTransactionStatus,
    handleReset,
  } = useInitUserVaultHooks();

  const [isOpen, setIsOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const handleConnect = async (wallet: Wallet) => {
    select(wallet.adapter.name);
    setIsOpen(false);
  };

  // TODO: Fix bug not update state to display transaction toast
  const handleStartInitUserVault = async () => {
    if (walletConnect) {
      const userVault = PublicKey.findProgramAddressSync(
        seeds.userVault(new PublicKey(walletConnect)),
        vertexProgram.programId
      )[0];

      const userVaultInfo = await connection.getAccountInfo(userVault);
      if (isNil(userVaultInfo)) {
        setTransactionStatus(BlockchainTransactionStatusEnum.LOADING);
        const txHash = await handleInitUserVault({
          walletAddress: new PublicKey(walletConnect),
        });
        setTransactionHash(txHash!);
        setTransactionStatus(BlockchainTransactionStatusEnum.SUCCESS);
      }
    }
  };

  useEffect(() => {
    const login = async () => {
      if (!publicKey || !wallet || isLoggedIn) return;

      try {
        const address = publicKey.toBase58();
        setWalletConnect(address);

        await handleLoginWallet({
          walletAddress: address,
          walletType: wallet.adapter.name as SolanaWalletsEnum,
        });

        setIsLoggedIn(true);
      } catch (error) {
        console.error("Login error:", error);
      }
    };

    login();
  }, [publicKey, wallet]);

  useEffect(() => {
    handleStartInitUserVault();
  }, [walletConnect]);

  useEffect(() => {
    console.log(transactionHash, transactionStatus);
    if (
      transactionHash &&
      transactionStatus &&
      transactionStatus !== BlockchainTransactionStatusEnum.LOADING
    ) {
      setIsToastOpen(true);
    }
  }, [transactionHash, transactionStatus]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Connect Wallet</Button>

      <Modal
        title="Connect Wallet"
        description=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth={"400px"}
      >
        <div className="flex flex-col gap-y-4">
          {wallets
            .filter((item) => item?.readyState === "Installed")
            .map((wallet, index) => (
              <WalletItem
                key={index}
                title={wallet?.adapter?.name}
                imgSrc={wallet?.adapter?.icon}
                onClick={() => {
                  handleConnect(wallet);
                }}
              />
            ))}
        </div>
      </Modal>

      {isToastOpen &&
        ReactDOM.createPortal(
          <CommonTransactionToast
            status={transactionStatus}
            transactionHash={transactionHash!}
            onReset={handleReset}
          />,
          document.body
        )}
    </>
  );
};

export default WalletConnect;

const WalletItem: React.FC<WalletItemProps> = ({
  title,
  imgSrc,
  className,
  ...otherProps
}) => {
  return (
    <button
      className={twMerge(
        "w-full",
        "px-4 py-2",
        "rounded-lg",
        "text-sm text-neutral1 font-medium",
        "border border-characterBackground2",
        "bg-characterBackground2 hover:bg-characterBackground3",
        "flex flex-row justify-between items-center gap-x-2",
        className
      )}
      {...otherProps}
    >
      <div className="flex flex-row gap-x-4 items-center">
        <img
          width={40}
          height={40}
          src={imgSrc}
          alt={title}
          className="rounded-full"
        />
        <span>{title}</span>
      </div>
    </button>
  );
};

interface WalletItemProps extends React.ComponentPropsWithoutRef<"button"> {
  imgSrc: string;
  title: string;
}
