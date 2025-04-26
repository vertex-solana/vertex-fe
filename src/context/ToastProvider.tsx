"use client";

import { Toaster } from "react-hot-toast";

export const ToasterProvider = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: "",
        duration: 3000,
      }}
    />
  );
};
