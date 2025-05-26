import React, { useState, useRef, useEffect, createContext, useContext } from "react";

const SelectContext = createContext();

export const Select = ({ children, value, onValueChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative w-full">{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = ({ children, className = "" }) => {
  const ref = useRef(null);
  const { value, open, setOpen } = useContext(SelectContext);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  return (
    <div ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full text-left px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      >
        {value || <span className="text-gray-400">Filter option</span>}
      </button>
      {open && <SelectContent>{children}</SelectContent>}
    </div>
  );
};

export const SelectContent = ({ children }) => {
  return (
    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg   ">
      {children}
    </div>
  );
};

export const SelectItem = ({ value, children }) => {
  const { onValueChange, setOpen } = useContext(SelectContext);

  const handleClick = () => {
    onValueChange(value);
    setOpen(false);
  };

  return (
    <div
      className="px-4 py-4 hover:bg-blue-100 cursor-pointer"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export const SelectValue = () => {
  const { value } = useContext(SelectContext);
  return <span></span>;
};
