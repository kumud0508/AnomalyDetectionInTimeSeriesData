import React, { useState } from "react";

// Select Component with State Handling
export const Select: React.FC<{ children: React.ReactNode, value: string, onValueChange: (val: string) => void }> = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block w-[180px]">
      <div onClick={() => setIsOpen(!isOpen)}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { isOpen, setIsOpen }) : child
        )}
      </div>
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === SelectContent
          ? React.cloneElement(child, { isOpen, onValueChange, setIsOpen })
          : null
      )}
    </div>
  );
};

// SelectTrigger Component
export const SelectTrigger: React.FC<{ className?: string, isOpen?: boolean }> = ({ className, children, isOpen }) => {
  return (
    <div className={`border px-4 py-2 rounded-md cursor-pointer ${className} ${isOpen ? "bg-gray-200" : "bg-white"}`}>
      {children}
    </div>
  );
};

// SelectValue Component
export const SelectValue: React.FC<{ placeholder: string }> = ({ placeholder }) => {
  return <div className="select-value">{placeholder}</div>;
};

// SelectContent Component with Visibility Toggle
export const SelectContent: React.FC<{
  isOpen?: boolean,
  children: React.ReactNode,
  onValueChange?: (val: string) => void,
  setIsOpen?: (val: boolean) => void
}> = ({ isOpen, children, onValueChange, setIsOpen }) => {
  return isOpen ? (
    <div className="absolute mt-1 w-full bg-white border rounded-md shadow-lg">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { onValueChange, setIsOpen })
          : child
      )}
    </div>
  ) : null;
};

// SelectItem Component with Click Handler
export const SelectItem: React.FC<{
  value: string,
  onValueChange?: (val: string) => void,
  setIsOpen?: (val: boolean) => void
}> = ({ value, children, onValueChange, setIsOpen }) => {
  return (
    <div
      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
      onClick={() => {
        if (onValueChange) onValueChange(value);
        if (setIsOpen) setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
};