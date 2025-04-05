import { FC, SVGProps } from 'react';

const ArrowUpLineIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <g clipPath="url(#clip0_261_18689)">
        <path
          d="M13 7.828V20H11V7.828L5.63605 13.192L4.22205 11.778L12 4L19.778 11.778L18.364 13.192L13 7.828Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_261_18689">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

ArrowUpLineIcon.displayName = 'ArrowUpLineIcon';
export default ArrowUpLineIcon;
