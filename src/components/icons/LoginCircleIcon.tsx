import { FC, SVGProps } from 'react';

const LoginCircleIcon: FC<SVGProps<SVGSVGElement>> = ({ ...otherProps }) => {
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
        d="M10 13V16L15 12L10 8V11H1L1 13H10ZM2.458 9H4.582C5.28005 7.28092 6.55371 5.8578 8.18512 4.97406C9.81652 4.09032 11.7043 3.80088 13.5255 4.15525C15.3468 4.50963 16.9883 5.48579 18.1693 6.91677C19.3503 8.34774 19.9975 10.1446 20 12C20.001 13.8573 19.3558 15.6572 18.1749 17.0908C16.994 18.5244 15.3511 19.5024 13.528 19.8572C11.7048 20.2119 9.81505 19.9213 8.18278 19.035C6.55051 18.1488 5.27747 16.7222 4.582 15H2.458C3.732 19.057 7.522 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2C7.522 2 3.732 4.943 2.458 9Z"
        fill="currentColor"
      />
    </svg>
  );
};

LoginCircleIcon.displayName = 'LoginCircleIcon';
export default LoginCircleIcon;
