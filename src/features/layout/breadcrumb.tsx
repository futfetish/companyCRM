import { FC, ReactNode } from "react";

export const BreadCrumbLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col w-full bg-[#F9FAFC] h-full">
      <div className="h-[80px] flex items-center text-[30px]  p-[8px] flex-shrink-0"> <strong>in development  </strong>   </div> 
      <div className="grow" >{children}</div>
    </div>
  );
};
