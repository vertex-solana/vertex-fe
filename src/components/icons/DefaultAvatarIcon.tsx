import { FC, SVGProps } from "react";

const DefaultAvatarIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path
        d="M11 8.75C12.933 8.75 14.5 7.183 14.5 5.25C14.5 3.317 12.933 1.75 11 1.75C9.067 1.75 7.5 3.317 7.5 5.25C7.5 7.183 9.067 8.75 11 8.75Z"
        fill="currentColor"
      />
      <path
        d="M18 15.3125C18 17.4869 18 19.25 11 19.25C4 19.25 4 17.4869 4 15.3125C4 13.1381 7.13425 11.375 11 11.375C14.8658 11.375 18 13.1381 18 15.3125Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default DefaultAvatarIcon;
