import { FC, SVGProps } from 'react';

const MediumIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      strokeWidth="1.2"
      viewBox="0 0 20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...otherProps}
    >
      <path d="M5.625 14.6875C8.04125 14.6875 10 12.5888 10 10C10 7.41117 8.04125 5.3125 5.625 5.3125C3.20875 5.3125 1.25 7.41117 1.25 10C1.25 12.5888 3.20875 14.6875 5.625 14.6875Z" />
      <path d="M14.375 14.375C15.4105 14.375 16.25 12.4162 16.25 10C16.25 7.58375 15.4105 5.625 14.375 5.625C13.3395 5.625 12.5 7.58375 12.5 10C12.5 12.4162 13.3395 14.375 14.375 14.375Z" />
      <path d="M18.75 5.625V14.375" />
    </svg>
  );
};

export default MediumIcon;
