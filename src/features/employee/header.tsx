import { Employee } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { getRoute } from "~/shared/i18n/routes";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Card } from "~/shared/ui/card";
import { IsFavoriteBox } from "~/shared/ui/isFavoriteBox";
import { api } from "~/shared/utils/api";

const tabs = ["", "resume"];

const getTabName = (tab: string) => {
  switch (tab) {
    case "":
      return "general";
    case "[name]":
      return "general";
    default:
      return tab;
  }
};

export const EmployeeHeader: FC<{ employee: Employee }> = ({ employee }) => {
  const router = useRouter();

  const path = router.pathname.split("/");

  const TAB = path[path.length - 1]!;

  
  const [isFavorite , setIsFavorite] = useState(employee.isFavorite)
  
  const { mutate: setFavorite } = api.employee.setFavorite.useMutation({
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite)
    },
  });

  const toggleIsFavorite = () => {
    setIsFavorite(!isFavorite)
    setFavorite({value : !isFavorite , id : employee.id})
  }

  return (
    <Card className="flex flex-col gap-[20px] px-[24px] py-[20px] pb-0">
      <div className="flex justify-between">
        <div className="flex items-center gap-[24px]">
          <Avatar className="h-[64px] w-[64px] rounded-[5px]">
            <AvatarFallback>{employee.fullName[0] ?? "E"}</AvatarFallback>
            <AvatarImage width={64} height={64} src={employee.image} />
          </Avatar>
          <div>
            <p className="text-[24px] font-bold leading-[32px]">
              {employee.fullName}
            </p>
            <p className="text-[16px] font-bold leading-[24px] text-[#8492A6]">
              @{employee.name}
            </p>
          </div>
        </div>
        <div>
          <IsFavoriteBox onClick={() => toggleIsFavorite() } isFavorite={isFavorite} />
        </div>
      </div>

      <div className="w-[calc(100% + 48px)] mx-[-24px] h-[2px] flex-shrink-0 bg-[#EFF2F7]"></div>
      <div className="flex gap-[16px]">
        {tabs.map((tab, index) => (
          <Link
            href={`/employee/${employee.name}/${tab}`}
            key={index}
            data-state={getTabName(tab) == getTabName(TAB) ? "active" : "close"}
            className="inline-flex cursor-pointer select-none items-center justify-center whitespace-nowrap border-b-[1px] border-transparent px-3 py-2.5 text-sm font-medium opacity-[50%] ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b data-[state=active]:border-black data-[state=active]:text-foreground data-[state=active]:opacity-[100%]"
          >
            {getRoute(getTabName(tab), "ru")}
          </Link>
        ))}
      </div>
    </Card>
  );
};
