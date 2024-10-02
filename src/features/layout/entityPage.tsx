import React, { FC, ReactNode } from 'react';

export const EntityPageLayout: FC<{children : [ ReactNode , ReactNode ]}> = ({ children }) => {
  const [search, content] = React.Children.toArray(children);

  return (
    <div className="flex w-full h-full">
      <div className="p-[24px] child h-full flex-shrink-0 w-[348px] bg-white">{search}</div>
      <div className='w-[2px] h-full bg-[#E5E9F2] flex-shrink-0 ' />
      <div className=" py-[24px] px-[40px] child h-full grow bg-white ">{content}</div>
    </div>
  );
};