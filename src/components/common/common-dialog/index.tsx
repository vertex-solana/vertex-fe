"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { CloseIcon } from "@/components/icons";
import { Root, Portal, Overlay, Content } from "@radix-ui/react-dialog";

const CommonDialog: React.FC<CommonDialogProps> = ({
  isOpen,
  onClose,
  children,
  dialogTitle,

  titleClassName,
  overlayClassName,
  contentClassName,
  closeIconClassName,
  wrapperTitleClassName,

  isShowIconClose = true,
  isPreventCloseOutside = false,
}) => {
  return (
    <Root open={isOpen} onOpenChange={onClose}>
      <Portal>
        <Overlay
          className={twMerge(
            "z-10",
            "fixed top-0 left-0 right-0 bottom-0",
            "overflow-y-auto place-items-center bg-blackBlur",
            overlayClassName
          )}
        />
        <Content
          onInteractOutside={(e) => {
            if (isPreventCloseOutside) {
              e.preventDefault();
            }
          }}
          className={twMerge(
            "animate-popUp",
            "p-4 fixed z-20",

            "w-full sm:w-[450px]",
            "max-h-[85vh] overflow-y-auto",
            "max-w-[100vw] sm:max-w-[450px]",

            "left-0 sm:left-1/2",
            "top-auto sm:top-1/2",
            "bottom-0 sm:bottom-auto",
            "translate-x-0 sm:-translate-x-1/2",
            "translate-y-0 sm:-translate-y-1/2",

            "focus-visible:outline-none",
            "bg-characterBackground3 shadow-2xl",
            "border rounded-2xl border-characterBackground2",
            contentClassName
          )}
        >
          <div className={twMerge("relative", wrapperTitleClassName)}>
            {dialogTitle && (
              <span className={twMerge("text-neutral1", titleClassName)}>
                {dialogTitle}
              </span>
            )}
            {isShowIconClose && (
              <CloseIcon
                className={twMerge(
                  "z-[100]",
                  "text-neutral5",
                  "absolute right-0 top-0 cursor-pointer",
                  closeIconClassName
                )}
                onClick={onClose}
              />
            )}
          </div>

          {children}
        </Content>
      </Portal>
    </Root>
  );
};

export default CommonDialog;

export interface CommonDialogProps
  extends React.ComponentPropsWithoutRef<"div"> {
  isOpen: boolean;
  onClose: () => void;

  titleClassName?: string;
  isShowIconClose?: boolean;
  dialogTitle?: React.ReactNode;
  isPreventCloseOutside?: boolean;

  overlayClassName?: string;
  contentClassName?: string;
  closeIconClassName?: string;
  wrapperTitleClassName?: string;
}
