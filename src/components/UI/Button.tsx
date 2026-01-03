import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary' 
}: ButtonProps) {
  const baseClasses = "block w-full font-mono uppercase px-6 py-3 border-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black",
    secondary: "border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-black"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
}