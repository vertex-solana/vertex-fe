"use client";

import React, { PropsWithChildren, useMemo } from "react";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { BlockChainUtils } from "@/utils";
import { LedgerWalletAdapter } from "@solana/wallet-adapter-wallets";

const SolanaProvider = ({ children }: PropsWithChildren) => {
  const endpoint = BlockChainUtils.getSolanaRpcEndpoint();

  const wallets = useMemo(() => [new LedgerWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaProvider;
