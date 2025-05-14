
import React from 'react';

export interface AppleProps {
  className?: string;
}

const Apple: React.FC<AppleProps> = ({ className }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.94 5.19A4.38 4.38 0 0 0 16 2a4.44 4.44 0 0 0-3 1.52 4.17 4.17 0 0 0-1 3.09 3.69 3.69 0 0 0 2.94-1.42z" fill="currentColor"/>
      <path d="M17.46 18.03c.4-.64.86-1.69.86-2.81 0-2.19-1.31-3.24-2.62-3.24-.87 0-1.69.45-2.18.45-.56 0-1.35-.45-2.32-.45-1.82 0-3.65 1.42-3.65 4.01 0 1.6.57 3.28 1.3 4.38.65.96 1.23 1.64 2.1 1.64.79 0 1.28-.45 2.14-.45.87 0 1.32.45 2.18.45.85 0 1.47-.73 2.07-1.63a10.88 10.88 0 0 0 .9-1.9l-.02-.02a.636.636 0 0 0-.1-.02c-1.19-.53-1.77-1.59-1.77-2.78 0-.95.52-1.85 1.11-2.29z" fill="currentColor"/>
    </svg>
  );
};

export default Apple;
