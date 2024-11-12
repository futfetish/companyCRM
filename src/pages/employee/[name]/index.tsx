import { Employee } from "@prisma/client";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { EmployeeHeader } from "~/features/employee/header";
import { BreadCrumbLayout } from "~/features/layout/breadcrumb";
import { NavBarLayout } from "~/features/layout/navBar";
import { db } from "~/server/db"; 

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { name } = ctx.params as { name: string };

  const employee = await db.employee.findUnique({
    where: {
      name,
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
          <div className="px-[40px]">
            <EmployeeHeader employee={employee} />
          </div>
        </BreadCrumbLayout>
      </NavBarLayout>
    </>
  );
}
