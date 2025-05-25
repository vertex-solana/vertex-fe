import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import { useWallet, Wallet } from "@solana/wallet-adapter-react";
import { useAuthContext } from "@/context";
import { SolanaWalletsEnum } from "@/models";

const WalletConnect = () => {
  const { wallets, select } = useWallet();

  const { handleLoginWallet, setWalletConnect, setIsLoggedIn } =
    useAuthContext();

  const [isOpen, setIsOpen] = useState(false);

  const handleConnect = async (wallet: Wallet) => {
    try {
      select(wallet.adapter.name);
      setIsOpen(false);

      await handleLoginWallet({
        walletAddress: wallet.adapter.publicKey!.toBase58(),
        walletType: wallet.adapter.name as SolanaWalletsEnum,
      });

      setWalletConnect(wallet.adapter.publicKey!.toBase58());
      setIsLoggedIn(true);
    } catch (error) {
      console.log(error);
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
