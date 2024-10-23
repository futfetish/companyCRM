import { useRouter } from "next/router";
import React, { FC, ReactNode } from "react";
import { getRoute as getRouteI18n } from "~/shared/i18n/routes";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/shared/ui/breadcrumb";

export const BreadCrumbLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const path = router.pathname.split("/");
  console.log(path.slice(0, 1).join("/"));

  const getRoute = (route: string): string => {
    if (route.startsWith("[") && route.endsWith("]")) {
      return (router.query[route.slice(1, -1)] ?? route) as string;
    } else {
      return getRouteI18n(route, "ru");
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F9FAFC]">
      <div className="flex h-[80px] flex-shrink-0 items-center p-[24px] text-[30px]">
        {path.length == 2 ? (
          <strong> {getRoute(path[1]!).toUpperCase()}</strong>
        ) : (
          <Breadcrumb>
            <BreadcrumbList className="text-[30px]">
              {path.map((route, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbItem>
                    {index < path.length - 1 ? (
                      <BreadcrumbLink
                        href={path.slice(0, index + 1).join("/") || "/"}
                      >
                        {getRoute(route)}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage> {getRoute(route)} </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < path.length - 1 && (
                    <BreadcrumbSeparator className="mt-[8px]" size={24} />
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>
      <div className="grow">{children}</div>
    </div>
  );
};
