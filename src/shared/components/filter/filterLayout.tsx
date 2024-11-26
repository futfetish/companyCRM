import { Settings2 } from "lucide-react";
import { FC, ReactNode } from "react"

export const FilterLayout : FC<{children : ReactNode}> = ({children}) => {
    return (
        <div className="flex flex-col gap-[24px]">
          <div className="flex h-[48px] w-full items-center justify-center rounded-full border border-[#D3DCE6] bg-[#F9FAFC]">
            search
          </div>
          <div className="flex items-center gap-[16px]">
            <p className="leading-28.8 text-[20px] font-normal text-[#8492A6]">
              НАСТРОЙКИ ФИЛЬТРА
            </p>
            <div>
              <Settings2 size={24} />
            </div>
          </div>
          {children}
        </div>
      );
}
