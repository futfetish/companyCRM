import React, { FC, ReactNode } from "react";

export const EntityPageLayout: FC<{ children: [ReactNode, ReactNode] , title : string }> = ({
  children,
  title
}) => {
  const [search, content] = React.Children.toArray(children);

  return (
    <div className="flex h-full w-full flex-col" > 
      <div className="bg-[#F9FAFC] flex h-[80px] flex-shrink-0 items-center p-[24px] text-[30px]">
      <strong> {title.toUpperCase()}</strong>
      </div>
      <div className="flex grow">
        <div className="child h-full w-[348px] flex-shrink-0 bg-white p-[24px]">
          {search}
        </div>
        <div className="h-full w-[2px] flex-shrink-0 bg-[#E5E9F2]" />
        <div className="child h-full grow bg-white px-[40px] py-[24px]">
          {content}
        </div>
      </div>
    </div>
  );
};
