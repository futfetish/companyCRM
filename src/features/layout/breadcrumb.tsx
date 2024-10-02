import { FC, ReactNode } from "react";

export const BreadCrumbLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="w-full">
      <div className="h-[80px] flex items-center text-[30px]  p-[8px]"> <strong>in development  </strong>   </div> 
      <div>{children}</div>
    </div>
  );
};
