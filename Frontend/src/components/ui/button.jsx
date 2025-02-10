import React from "react";
import { cn } from "@/lib/utils"; // Utility function for classNames

const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition hover:opacity-80 focus:outline-none",
        "bg-blue-500 text-white", // Default styles
        className // Allow custom styles
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
