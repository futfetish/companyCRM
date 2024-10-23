import {
  Company,
  Employee as EmployeeI,
  EmploymentStatus,
  EmploymentType,
  Position,
} from "@prisma/client";
import { Settings2 } from "lucide-react";
import Head from "next/head";
import { FC } from "react";
import { BreadCrumbLayout } from "~/features/layout/breadcrumb";
import { EntityPageLayout } from "~/features/layout/entityPage";
import { NavBarLayout } from "~/features/layout/navBar";
import { db } from "~/server/db";
import { Col, List } from "~/shared/components/list/list";
import { getCompanyType, getEmploymentType } from "~/shared/i18n/db";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui/tabs";
import { api } from "~/shared/utils/api";
import { convertToPlural } from "~/shared/utils/morph";
import {
  $employees,
  $employeesCompaniesIds,
  $employeesPositionIds,
  $employeesStatusList,
  $employeesType,
  $filteredEmployees,
  addCompanyId,
  addPositionId,
  addStatus,
  removeCompanyId,
  removePositionId,
  removeStatus,
  setEmployees,
  setEmployeesType,
} from "~/store/employeeStore";
import { useUnit } from "effector-react";
import { FilterAccordionCheckbox } from "~/shared/components/filter/accordionCheckbox";
import { FilterAccordion } from "~/shared/components/filter/accordion";
import { cn } from "~/shared/utils/cn";
import Link from "next/link";

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
                  <EmployeeList />
                </TabsContent>
              ))}
            </Tabs>
          </EntityPageLayout>
        </BreadCrumbLayout>
      </NavBarLayout>
    </>
  );
}

const EmployeeList: FC = () => {
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
        return  (
            <Link href={`employee/${item.name}`}>
               <EmployeeInfo employee={item} />
            </Link>
        )
       
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
      <EmployeesStatusFilter />
      <EmployeesCompanyFilter />
    </div>
  );
};

const EmployeesPositionFilter: FC = () => {
  const { data: positions } = api.employee.getPositions.useQuery();
  const positionsIds = useUnit($employeesPositionIds);
  const employees = useUnit($employees);
  const type = useUnit($employeesType);
  const togglePositionId = ({ id }: Position) => {
    if (positionsIds.has(id)) {
      removePositionId(id);
    } else {
      addPositionId(id);
    }
  };
  if (positions && positions.length > 0) {
    return (
      <FilterAccordionCheckbox<Position>
        list={positions}
        toggle={togglePositionId}
        title="ДОЛЖНОСТЬ"
        render={(position) => position.title}
        count={(position) =>
          employees.filter(
            (employee) =>
              employee.type == type && employee.positionId == position.id,
          ).length
        }
        checked={(position) => positionsIds.has(position.id)}
      />
    );
  }
};

const EmployeesStatusFilter: FC = () => {
  const statusChecked = useUnit($employeesStatusList);
  const employees = useUnit($employees);
  const type = useUnit($employeesType);
  const statusList = Array.from(
    new Set(
      employees
        .filter((employee) => employee.type == type)
        .map((employee) => employee.status),
    ),
  );

  const toggleStatusId = (status: EmploymentStatus) => {
    if (statusChecked.has(status)) {
      removeStatus(status);
    } else {
      addStatus(status);
    }
  };

  return (
    <FilterAccordionCheckbox<EmploymentStatus>
      list={statusList}
      toggle={toggleStatusId}
      checked={(status) => statusChecked.has(status)}
      title="СТАТУС"
      count={(status) =>
        employees.filter(
          (employee) => employee.type == type && employee.status == status,
        ).length
      }
      render={(status) => status}
    />
  );
};

const EmployeesCompanyFilter: FC = () => {
  const employees = useUnit($employees);
  const type = useUnit($employeesType);
  const companyChecked = useUnit($employeesCompaniesIds);
  const companyList = Array.from(
    new Map(
      employees
        .filter((employee) => employee.type === type)
        .map((employee) => [employee.company.id, employee.company]),
    ).values(),
  );
  const toggle = (company: Company) => {
    if (companyChecked.has(company.id)) {
      removeCompanyId(company.id);
    } else {
      addCompanyId(company.id);
    }
  };
  return (
    <FilterAccordion<Company>
      render={(company) => (
        <div
          className={cn(
            companyChecked.has(company.id) ? "opacity-100" : "opacity-50",
          )}
        >
          <CompanyInfo company={company} />
        </div>
      )}
      count={(company) =>
        employees.filter(
          (employee) =>
            employee.type == type && employee.company.id == company.id,
        ).length
      }
      toggle={toggle}
      title="КОМПАНИИ"
      list={companyList}
    />
  );
};
