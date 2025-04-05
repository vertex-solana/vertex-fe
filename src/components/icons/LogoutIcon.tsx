import { FC, SVGProps } from "react";

const LogoutIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path
        d="M5 22.5C4.73478 22.5 4.48043 22.3946 4.29289 22.2071C4.10536 22.0196 4 21.7652 4 21.5V3.5C4 3.23478 4.10536 2.98043 4.29289 2.79289C4.48043 2.60536 4.73478 2.5 5 2.5H19C19.2652 2.5 19.5196 2.60536 19.7071 2.79289C19.8946 2.98043 20 3.23478 20 3.5V6.5H18V4.5H6V20.5H18V18.5H20V21.5C20 21.7652 19.8946 22.0196 19.7071 22.2071C19.5196 22.3946 19.2652 22.5 19 22.5H5ZM18 16.5V13.5H11V11.5H18V8.5L23 12.5L18 16.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default LogoutIcon;
