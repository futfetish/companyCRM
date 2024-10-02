import { FC, ReactNode } from "react"
import { GeistSans } from "geist/font/sans";
import { cn } from "~/shared/utils";

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {

    return  <div className={cn(GeistSans.className, "w-[100svw] h-[100svh] bg-[#F9FAFC]")} > {children} </div>
 }