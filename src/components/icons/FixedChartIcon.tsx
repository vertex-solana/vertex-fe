import { FC, SVGProps } from "react";

const FixedChartIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="173"
      height="76"
      viewBox="0 0 173 76"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path
        d="M48.457 50.0087L0 76H173V0L143.883 35.5325L48.457 50.0087Z"
        fill="url(#paint0_linear_3536_10520)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3536_10520"
          x1="86.5"
          y1="0"
          x2="86.5"
          y2="76"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00FFC0" />
          <stop offset="1" stopColor="#00FFC0" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default FixedChartIcon;
