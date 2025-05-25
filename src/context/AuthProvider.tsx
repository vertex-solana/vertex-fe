"use client";

import React, { useContext, useState } from "react";
import { AuthContextInterface } from "@/models/context.model";
import useAuthHook from "@/hooks/auth-hooks";


const INITIAL_STATE = {} as AuthContextInterface;

const AuthContext = React.createContext(INITIAL_STATE);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletConnect, setWalletConnect] = useState<string | null>(null);

  const { handleLogout, handleLoginWallet } = useAuthHook();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,

        walletConnect,
        setWalletConnect,

        handleLoginWallet,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

interface AuthProviderProps {
  children: React.ReactNode;
}
