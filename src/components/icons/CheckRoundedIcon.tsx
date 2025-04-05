import { FC, SVGProps } from "react";

const CheckRoundedIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path
        d="M8.86744 12.1L14.5174 6.45C14.6508 6.31667 14.8063 6.25 14.9841 6.25C15.1619 6.25 15.3174 6.31667 15.4508 6.45C15.5841 6.58333 15.6508 6.74178 15.6508 6.92533C15.6508 7.10889 15.5841 7.26711 15.4508 7.4L9.3341 13.5333C9.20077 13.6667 9.04522 13.7333 8.86744 13.7333C8.68966 13.7333 8.5341 13.6667 8.40077 13.5333L5.5341 10.6667C5.40077 10.5333 5.33677 10.3751 5.3421 10.192C5.34744 10.0089 5.41699 9.85044 5.55077 9.71667C5.68455 9.58289 5.84299 9.51622 6.0261 9.51667C6.20922 9.51711 6.36744 9.58378 6.50077 9.71667L8.86744 12.1Z"
        fill="black"
      />
    </svg>
  );
};

CheckRoundedIcon.displayName = "CheckRoundedIcon";
export default CheckRoundedIcon;
