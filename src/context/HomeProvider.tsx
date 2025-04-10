"use client";

import React, { useContext, useState } from "react";
import { HomeContextInterface } from "@/models/context.model";

const INITIAL_STATE = {} as HomeContextInterface;

const HomeContext = React.createContext(INITIAL_STATE);

export const useHomeContext = () => useContext(HomeContext);

export const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  return <HomeContext.Provider value={{}}>{children}</HomeContext.Provider>;
};

interface HomeProviderProps {
  children: React.ReactNode;
}
