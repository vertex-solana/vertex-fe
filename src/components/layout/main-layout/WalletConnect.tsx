import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useAppContext, useAuthContext } from "@/context";
import { SolanaWalletsEnum } from "@/models";
import { PublicKey } from "@solana/web3.js";
import useInitUserVaultHooks from "@/hooks/billing-hooks/useInitUserVaultHooks";
import { seeds } from "@/services/billing-service/sdk";
import { isNil } from "lodash";
import { useAppHooks } from "@/hooks";
import { ExecutionLayer } from "@/models/app.model";

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
  const { handleSubmitVertexBillingTransaction } = useAppHooks();
  const { handleInitUserVault } = useInitUserVaultHooks();

  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (wallet: Wallet) => {
    select(wallet.adapter.name);
    setIsOpen(false);
  };

  const isMounted = React.useRef(true);
  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  useEffect(() => {
    const login = async () => {
      if (!publicKey || !wallet || isLoggedIn) return;

      const address = publicKey.toBase58();

      const walletAddressConnect = await handleLoginWallet({
        walletAddress: address,
        walletType: wallet.adapter.name as SolanaWalletsEnum,
      });
      if (!walletAddressConnect) return;

      setWalletConnect(address);

      if (isMounted.current) setIsLoggedIn(true);
    };

    login();
  }, [publicKey, wallet]);

  useEffect(() => {
    if (isLoggedIn && walletConnect) {
      console.log("Starting init user vault safe");
      handleStartInitUserVaultSafe(new PublicKey(walletConnect));
    }
  }, [walletConnect]);

  const handleStartInitUserVaultSafe = async (walletAddress: PublicKey) => {
    try {
      const userVault = PublicKey.findProgramAddressSync(
        seeds.userVault(walletAddress),
        vertexProgram.programId
      )[0];
      const userVaultData = await connection.getAccountInfo(userVault);
      if (isNil(userVaultData)) {
        const txHash = await handleInitUserVault({
          walletAddress,
        });
        if (!isMounted.current) return;

        await handleSubmitVertexBillingTransaction({
          executionLayer: ExecutionLayer.BASE_CHAIN,
          txHash: txHash!,
        });
      }
    } catch (e) {
      if (!isMounted.current) return;
      console.error(e);
    }
  };

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
