import React from "react";
import { cn } from "@/lib/utils"; // Utility function for classNames

export const Card = ({ children, className }) => {
  return (
    <div className={cn("bg-white shadow-md rounded-lg p-4", className)}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div className={cn("border-b pb-2 mb-2 text-lg font-semibold", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }) => {
  return <div className={cn("p-2", className)}>{children}</div>;
};
