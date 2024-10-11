import {
  Company,
  Employee as EmployeeI,
  EmploymentType,
  Position,
} from "@prisma/client";
import { Accordion } from "@radix-ui/react-accordion";
import { Settings2 } from "lucide-react";
import Head from "next/head";
import { FC, useState } from "react";
import { BreadCrumbLayout } from "~/features/layout/breadcrumb";
import { EntityPageLayout } from "~/features/layout/entityPage";
import { NavBarLayout } from "~/features/layout/navBar";
import { db } from "~/server/db";
import { Col, List } from "~/shared/components/list/list";
import { getCompanyType, getEmploymentType } from "~/shared/i18n/db";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/shared/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Checkbox } from "~/shared/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui/tabs";
import { api } from "~/shared/utils/api";
import { convertToPlural } from "~/shared/utils/morph";
import {
  $employees,
  $employeesType,
  $filteredEmployees,
  $positionIds,
  addPositionId,
  removePositionId,
  setEmployees,
  setEmployeesType,
} from "~/store/employeeStore";
import { useUnit } from "effector-react";

interface Employee extends EmployeeI {
  company: Company;
  position: Position;
}

export async function getServerSideProps() {
  const employees = await db.employee.findMany({
    include: {
      position: true,
      company: true,
    },
  });

  return {
    props: {
      employees,
    },
  };
}

export default function Employe({ employees }: { employees: Employee[] }) {
  setEmployees(employees);

  const typeList: EmploymentType[] = Object.keys(
    EmploymentType,
  ) as EmploymentType[];

  const tab = useUnit($employeesType);

  return (
    <>
      <Head>
        <title> Люди </title>
      </Head>
      <NavBarLayout>
        <BreadCrumbLayout>
          <EntityPageLayout>
            <EmployeesFilter />
            <Tabs
              className=""
              value={tab}
              onValueChange={(value) =>
                setEmployeesType(value as EmploymentType)
              }
            >
              <TabsList>
                {typeList.map((type, index) => (
                  <TabsTrigger
                    value={type}
                    key={index}
                    className="flex gap-[8px]"
                  >
                    {type == "archive" || type == "other"
                      ? getEmploymentType(type, "ru")
                      : convertToPlural(getEmploymentType(type, "ru"))}
                    <div className="rounded-[8px] bg-[#050504] px-[8px] py-[4px] text-center text-[12px] font-normal leading-[16px] tracking-tighter text-white">
                      {
                        employees.filter((employee) => employee.type == type)
                          .length
                      }
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
              {typeList.map((type, index) => (
                <TabsContent value={type} key={index}>
                  <EmployeeList type={type} />
                </TabsContent>
              ))}
            </Tabs>
          </EntityPageLayout>
        </BreadCrumbLayout>
      </NavBarLayout>
    </>
  );
}

const EmployeeList: FC<{ type: EmploymentType }> = ({ type }) => {
  const employees = useUnit($filteredEmployees);

  const { mutate: setFavorite } = api.employee.setFavorite.useMutation({
    onSuccess: (data) => {
      const emp = employees.find((e) => e.id == data.id);
      if (emp) {
        setEmployees(
          employees.map((e) =>
            e.id === emp.id ? { ...e, isFavorite: data.isFavorite } : e,
          ),
        );
      }
    },
  });

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
      <List<Employee>
        defaultSort={"name"}
        onFavorite={(item, status) => {
          const emp = employees.find((e) => e.id == item.id);
          if (emp) {
            emp.isFavorite = status;
            setEmployees(
              employees.map((e) =>
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
          {getCompanyType(company.type, "ru")}
        </p>
      </div>
    </div>
  );
};

const EmployeesFilter: FC = () => {
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
      <EmployeesPositionFilter />
    </div>
  );
};

const EmployeesPositionFilter: FC = () => {
  const { data: positions } = api.employee.getPositions.useQuery();
  const positionsIds = useUnit($positionIds);
  const employees = useUnit($employees);
  const togglePositionId = (id: number) => {
    if (positionsIds.has(id)) {
      removePositionId(id);
    } else {
      addPositionId(id);
    }
  };

  return (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>ДОЛЖНОСТЬ</AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-[10px]">
            {positions &&
              positions.map((position) => (
                <div
                  key={position.id}
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => togglePositionId(position.id)}
                >
                  <div className="flex items-center gap-[16px]" >
                    <Checkbox checked={positionsIds.has(position.id)} />
                    {position.title}
                  </div>
                  <div className="font-bold" > 
                    { employees.filter((employee) => employee.type == $employeesType.getState() && employee.positionId == position.id).length }
                  </div>
                </div>
              ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
