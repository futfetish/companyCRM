import {
  Company,
  Employee as EmployeeI,
  EmploymentType,
  Position,
} from "@prisma/client";
import Head from "next/head";
import { FC, useEffect, useState } from "react";
import { BreadCrumbLayout } from "~/features/layout/breadcrumb";
import { EntityPageLayout } from "~/features/layout/entityPage";
import { NavBarLayout } from "~/features/layout/navBar";
import { Col, List } from "~/shared/components/list/list";
import { getEmploymentType } from "~/shared/i18n/db";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui/tabs";
import { api } from "~/shared/utils/api";
import { convertToPlural } from "~/shared/utils/morph";

export default function Employee() {
  const typeList: EmploymentType[] = Object.keys(
    EmploymentType,
  ) as EmploymentType[];

  const [tab, setTab] = useState<string | undefined>("staff");

  return (
    <>
      <Head>
        <title> Люди </title>
      </Head>
      <NavBarLayout>
        <BreadCrumbLayout>
          <EntityPageLayout>
            <div> 123 </div>
            <Tabs
              className=""
              value={tab}
              onValueChange={(value) => setTab(value)}
            >
              <TabsList>
                {typeList.map((type, index) => (
                  <TabsTrigger value={type} key={index}>
                    {type == "archive" || type == "other"
                      ? getEmploymentType(type, "ru")
                      : convertToPlural(getEmploymentType(type, "ru"))}
                  </TabsTrigger>
                ))}
              </TabsList>
              {typeList.map(
                (type, index) =>
                  tab === type && (
                    <TabsContent value={type} key={index}>
                      <EmployeeList type={type} />
                    </TabsContent>
                  ),
              )}
            </Tabs>
          </EntityPageLayout>
        </BreadCrumbLayout>
      </NavBarLayout>
    </>
  );
}

interface Employee extends EmployeeI {
  company: Company;
  position: Position;
}

const EmployeeList: FC<{ type: EmploymentType }> = ({ type }) => {
  const { data } = api.employee.select.useQuery({ types: [type] });
  const [employees, setEmployees] = useState<Employee[]>([]);

  const { mutate: setFavorite } = api.employee.setFavorite.useMutation({
    onSuccess: (data) => {
      const emp = employees.find((e) => e.id == data.id);
      if (emp) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((e) =>
            e.id === emp.id ? { ...e, isFavorite: data.isFavorite } : e,
          ),
        );
      }
    },
  });

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);

  console.log(employees);

  const cols: Col<Employee>[] = [
    {
      width: 300,
      title: "Имя",
      value: "name",
      render: ({ item }) => {
        return <EmployeeInfo employee={item} />;
      },
      sort: (items, direction) => {
        return items.sort((a, b) => {
          if (direction === "asc") {
            return a.fullName.localeCompare(b.fullName); // Сортировка по имени в алфавитном порядке
          } else {
            return b.fullName.localeCompare(a.fullName); // Сортировка по имени в обратном порядке
          }
        });
      },
    },
    {
      width: 300,
      title: "Компания",
      value: "company",
      render: ({ item }) => {
        return <CompanyInfo company={item.company} />;
      },
      sort: (items, direction) => {
        return items.sort((a, b) => {
          if (direction === "asc") {
            return a.company.name.localeCompare(b.company.name); // Сортировка по имени компании
          } else {
            return b.company.name.localeCompare(a.company.name); // Обратная сортировка
          }
        });
      },
    },
  ];

  return (
    <div>
      {getEmploymentType(type, "ru")}
      <List<Employee>
        defaultSort={'name'}
        onFavorite={(item, status) => {
          const emp = employees.find((e) => e.id == item.id);
          if (emp) {
            emp.isFavorite = status;
            setEmployees((prevEmployees) =>
              prevEmployees.map((e) =>
                e.id === emp.id ? { ...e, isFavorite: status } : e,
              ),
            );
            setFavorite({ value: status, id: item.id });
          }

          console.log(item.id, `fav: ${status}`);
        }}
        cols={cols}
        list={employees}
      />
    </div>
  );
};

const EmployeeInfo: FC<{ employee: EmployeeI & { position: Position } }> = ({
  employee,
}) => {
  return (
    <div className="flex items-center gap-[16px]">
      <Avatar>
        <AvatarFallback>{employee.fullName[0] ?? "E"}</AvatarFallback>
        <AvatarImage width={48} height={48} src={employee.image} />
      </Avatar>
      <div>
        <p className="text-[16px] font-extrabold leading-[24px] text-[#3C4858]">
          {employee.fullName}
        </p>
        <p className="text-[12px] font-medium leading-[16px] text-[#8492A6]">
          {employee.position.title}
        </p>
      </div>
    </div>
  );
};

const CompanyInfo: FC<{ company: Company }> = ({ company }) => {
  return (
    <div className="flex items-center gap-[16px]">
      <Avatar>
        <AvatarFallback>{company.name[0] ?? "E"}</AvatarFallback>
        <AvatarImage width={48} height={48} src={company.image} />
      </Avatar>
      <div>
        <p className="text-[16px] font-extrabold leading-[24px] text-[#3C4858]">
          {company.name}
        </p>
        <p className="text-[12px] font-medium leading-[16px] text-[#8492A6]">
          {company.type}
        </p>
      </div>
    </div>
  );
};
