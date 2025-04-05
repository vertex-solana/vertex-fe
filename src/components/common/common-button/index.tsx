import React, { ComponentPropsWithoutRef, useMemo } from "react";
import { twJoin, twMerge } from "tailwind-merge";

const CommonButton: React.FC<CommonButtonProps> = ({
  variant = CommonButtonVariantEnum.Primary,
  children,
  className,
  disabled,
  ...otherProps
}) => {
  const buttonVariantStyle = useMemo(() => {
    switch (variant) {
      case CommonButtonVariantEnum.Primary:
        return twJoin("bg-primary6", "text-neutral1", "border-primary6");
      case CommonButtonVariantEnum.Outlined:
        return twJoin("bg-neutral1", "text-primary5", "border-neutral3");
      case CommonButtonVariantEnum.GreenLinear:
        return twJoin(
          "border",
          "bg-bgGreenLinearButton",
          "text-white rounded-full",
          "drop-shadow-shadowGreenLinearButton"
        );
      case CommonButtonVariantEnum.Gray:
        return twJoin(
          "text-white",
          "bg-white/15",
          "rounded-full border-white/15"
        );
      case CommonButtonVariantEnum.Character:
        return twJoin(
          "border-none",
          "bg-characterUp",
          "text-[#0A0C0D]",
          "font-whiteRabbit"
        );
      case CommonButtonVariantEnum.Link:
        return twJoin("border-transparent", "bg-none", "text-primary6");
      default:
        return "";
    }
  }, [variant]);

  return (
    <button
      className={twMerge(
        "relative",
        "center-root",
        "border rounded",
        "text-base font-inter",
        "py-2 px-3 md:px-4 md:py-3",
        "focus-visible:outline-none",
        disabled ? "opacity-80" : "",
        buttonVariantStyle,
        className
      )}
      disabled={disabled}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default CommonButton;

export interface CommonButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: CommonButtonVariantEnum;
}

export enum CommonButtonVariantEnum {
  Gray = "Gray",
  Primary = "primary",
  Outlined = "outlined",
  GreenLinear = "green-linear",
  Character = "character",
  Link = "link",
}
