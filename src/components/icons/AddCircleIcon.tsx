import { FC, SVGProps } from 'react';

const AddCircleIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...otherProps}
    >
      <path
        d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM11 13H7V11H11L11 7H13L13 11L17 11V13L13 13V17H11V13Z"
        fill="currentColor"
      />
    </svg>
  );
};

AddCircleIcon.displayName = 'AddCircleIcon';
export default AddCircleIcon;
