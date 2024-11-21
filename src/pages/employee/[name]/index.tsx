import { Company, Employee as EmployeeI, Position } from "@prisma/client";
import { BadgeCheck, Mail, Phone } from "lucide-react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { EmployeeHeader } from "~/features/employee/header";
import { BreadCrumbLayout } from "~/features/layout/breadcrumb";
import { NavBarLayout } from "~/features/layout/navBar";
import { db } from "~/server/db";
import { getEmploymentType } from "~/shared/i18n/db";
import { Card } from "~/shared/ui/card";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { name } = ctx.params as { name: string };

  const employee = await db.employee.findUnique({
    where: {
      name,
    },
    include: {
      position: true,
      company: true,
    },
  });

  console.log("gsspd", name, employee);

  if (!employee) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      employee,
    },
  };
};

interface Employee extends EmployeeI {
  company: Company;
  position: Position;
}

export default function EmployeByNamePage({
  employee,
}: {
  employee: Employee;
}) {
  return (
    <>
      <Head>
        <title> Люди </title>
      </Head>
      <NavBarLayout>
        <BreadCrumbLayout>
          <div className="flex h-full flex-col gap-[24px] px-[40px] pb-[40px]">
            <EmployeeHeader employee={employee} />
            <div className="flex grow gap-[24px]">
              <Card className="relative flex h-full w-[350px] flex-col gap-[20px] px-[24px] py-[20px] pt-[72px]">
                <div className="absolute left-0 top-[24px] bg-[#D3DCE6] px-[24px] py-[4px] text-center text-[14px] font-normal leading-[16px]">
                  {getEmploymentType(employee.type, "ru").toLocaleLowerCase()}
                </div>
                <div className="flex gap-[16px]">
                  <div>
                    <Phone size={24} />
                  </div>
                  <div>{employee.phone}</div>
                </div>
                <div className="flex gap-[16px]">
                  <div>
                    <Mail size={24} />
                  </div>
                  <div>{employee.email}</div>
                </div>
                <div className="flex gap-[16px]">
                  <div>
                    <BadgeCheck size={24} />
                  </div>
                  <div>
                    {employee.position.title} в 
                    <Link href={'company/' + employee.company.id} className="font-medium"> {employee.company.name}</Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </BreadCrumbLayout>
      </NavBarLayout>
    </>
  );
}
