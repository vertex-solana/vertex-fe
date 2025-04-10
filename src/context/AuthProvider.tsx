"use client";

import React, { useContext } from "react";

import { AppConstant } from "@/const";
import { AuthContextInterface } from "@/models/context.model";

import useAuthHook from "@/hooks/auth-hooks";

import Cookies from "js-cookie";

const INITIAL_STATE = {} as AuthContextInterface;

const AuthContext = React.createContext(INITIAL_STATE);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const token = Cookies.get(AppConstant.KEY_TOKEN);

  const { handleLogout } = useAuthHook();

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

interface AuthProviderProps {
  children: React.ReactNode;
}
