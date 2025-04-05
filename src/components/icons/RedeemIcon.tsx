import { FC, SVGProps } from "react";

const RedeemIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path
        d="M8.23999 8.69997L11.54 12H3.99866V4.45864L7.29866 7.75864L11.0693 3.9873L12.0127 4.92997L8.23999 8.69997Z"
        fill="#F9FAFB"
      />
    </svg>
  );
};

export default RedeemIcon;
