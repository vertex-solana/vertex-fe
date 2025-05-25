"use client";

import React, { PropsWithChildren, useMemo } from "react";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";

import { BlockChainUtils } from "@/utils";

const SolanaProvider = ({ children }: PropsWithChildren) => {
  const endpoint = BlockChainUtils.getSolanaRpcEndpoint();

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={[]}>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaProvider;
