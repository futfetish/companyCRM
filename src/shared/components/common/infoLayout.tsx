import { FC, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";

export const InfoLayout: FC<{
  image: string;
  children: ReactNode;
  imageFallBack?: string;
}> = ({ image, children, imageFallBack }) => {
  return (
    <div className="flex items-center gap-[16px]">
      <Avatar>
        {imageFallBack && (
          <AvatarFallback>{imageFallBack}</AvatarFallback>
        )}

        <AvatarImage width={48} height={48} src={image} />
      </Avatar>
      <div>
       {children}
      </div>
    </div>
  );
};
