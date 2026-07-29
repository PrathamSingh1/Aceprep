import { cn } from "@/lib/utils";
import React from "react";

export const Sidebar = ({ children, className }: {
  children: React.ReactNode,
  className?: string,
}) => {
  return (
    <div className={cn("", className)}>{children}</div>
  )
}
