import { EmploymentType } from "@prisma/client";
import Head from "next/head";
import { BreadCrumbLayout } from "~/features/layout/breadcrumb";
import { EntityPageLayout } from "~/features/layout/entityPage";
import { NavBarLayout } from "~/features/layout/navBar";
import { getEmploymentType } from "~/shared/i18n/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui/tabs";
import { convertToPlural } from "~/shared/utils/morph";

export default function Employee() {
  const typeList: EmploymentType[] = Object.keys(
    EmploymentType,
  ) as EmploymentType[];

  return (
    <>
      <Head>
        <title> Люди </title>
      </Head>
      <NavBarLayout>
        <BreadCrumbLayout>
          <EntityPageLayout>
            <div> 123 </div>
            <Tabs defaultValue="staff" className="">
              <TabsList>
                {typeList.map((type, index) => (
                  <TabsTrigger value={type} key={index}>
                    {type == "archive" || type == 'other'
                      ? getEmploymentType(type, "ru")
                      : convertToPlural(getEmploymentType(type, "ru"))}
                  </TabsTrigger>
                ))}
              </TabsList>
              {typeList.map((type, index) => (
                <TabsContent value={type} key={index}>
                  {" "}
                  {getEmploymentType(type, "ru")}{" "}
                </TabsContent>
              ))}
            </Tabs>
          </EntityPageLayout>
        </BreadCrumbLayout>
      </NavBarLayout>
    </>
  );
}
