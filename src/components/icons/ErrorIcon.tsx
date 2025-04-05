import { FC, SVGProps } from "react";

const ErrorIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <circle cx="10" cy="10" r="10" fill="#FAAD14" />
      <path
        d="M10.6667 13H9.33333V14.3333C9.33333 14.7015 9.63181 15 10 15C10.3682 15 10.6667 14.7015 10.6667 14.3333V13ZM9.33333 11H10.6667L10.9445 5.99846C10.9747 5.45622 10.5431 5 10 5C9.45692 5 9.02535 5.45622 9.05547 5.99846L9.33333 11Z"
        fill="black"
      />
    </svg>
  );
};

ErrorIcon.displayName = "ErrorIcon";
export default ErrorIcon;
