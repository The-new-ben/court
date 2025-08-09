
import React from 'react';

export const GavelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m14 13-5 5" />
    <path d="M16 16 12 12" />
    <path d="m15.5 15.5 3 3" />
    <path d="M2 22l5-5" />
    <path d="M7.5 13.5 10 11" />
    <path d="M10.42 10.42 3.33 3.33c-.45-.45-.45-1.2-.04-1.65.4-.46 1.16-.47 1.65-.04l7.08 7.08" />
    <path d="m18.5 2.5 2.5 2.5" />
  </svg>
);
