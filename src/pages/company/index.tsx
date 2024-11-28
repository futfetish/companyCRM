import {
  Company as CompanyI,
  CompanyType,
  Country,
  region,
  WorkSchedule,
} from "@prisma/client";
import { useUnit } from "effector-react";

import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import { EntityPageLayout } from "~/features/layout/entityPage";
import { NavBarLayout } from "~/features/layout/navBar";
import { db } from "~/server/db";
import { InfoLayout } from "~/shared/components/common/infoLayout";
import { FilterLayout } from "~/shared/components/filter/filterLayout";
import { Col, List } from "~/shared/components/list/list";
import { getCompanyType } from "~/shared/i18n/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui/tabs";
import { api } from "~/shared/utils/api";
import { convertToPlural } from "~/shared/utils/morph";
import {
  $companyType,
  $filteredCompanies,
  setCompanies,
  setCompanyType,
} from "~/store/companyStore";

interface Company extends CompanyI {
  region: region;
  country: Country;
  workSchedule: WorkSchedule;
}

export async function getServerSideProps() {
  const companies = await db.company.findMany({
    include: {
      region: true,
      country: true,
      workSchedule: true,
    },
  });

  const serializedCompanies = companies.map((company) => ({
    ...company,
    workSchedule: {
      ...company.workSchedule,
      start: company.workSchedule.start.toISOString(),
      end: company.workSchedule.end.toISOString(),
    },
  }));

  return {
    props: {
      companies: serializedCompanies,
    },
  };
}

export default function CompaniesPage({ companies }: { companies: Company[] }) {
  companies = companies.map((company) => ({
    ...company,
    workSchedule: {
      ...company.workSchedule,
      start: new Date(company.workSchedule.start),
      end: new Date(company.workSchedule.end),
    } as WorkSchedule,
  }));

  setCompanies(companies);

  const typeList: CompanyType[] = Object.keys(CompanyType) as CompanyType[];

  const tab = useUnit($companyType);
  return (
    <>
      <Head>
        <title> Компании </title>
      </Head>
      <NavBarLayout>
        <EntityPageLayout title="компании">
          <CompanyFilter />
          <Tabs
            className=""
            value={tab}
            onValueChange={(value) => setCompanyType(value as CompanyType)}
          >
            <TabsList>
              {typeList.map((type, index) => (
                <TabsTrigger
                  value={type}
                  key={index}
                  className="flex gap-[8px]"
                >
                  {type == "archive" || type == "other"
                    ? getCompanyType(type, "ru")
                    : convertToPlural(getCompanyType(type, "ru"))}
                  <div className="rounded-[8px] bg-[#050504] px-[8px] py-[4px] text-center text-[12px] font-normal leading-[16px] tracking-tighter text-white">
                    {companies.filter((company) => company.type == type).length}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
            {typeList.map((type, index) => (
              <TabsContent value={type} key={index}>
                <CompanyList />
              </TabsContent>
            ))}
          </Tabs>
        </EntityPageLayout>
      </NavBarLayout>
    </>
  );
}

const CompanyList: FC = () => {
  const companies = useUnit($filteredCompanies);

  const { mutate: setFavorite } = api.company.setFavorite.useMutation({
    onSuccess: (data) => {
      const company = companies.find((c) => c.id == data.id);
      if (company) {
        setCompanies(
          companies.map((c) =>
            c.id === company.id ? { ...c, isFavorite: data.isFavorite } : c,
          ),
        );
      }
    },
  });

  const cols: Col<Company>[] = [
    {
      width: 300,
      title: "Название",
      value: "name",
      render: ({ item }) => {
        return (
          <Link href={`company/${item.name}`}>
            <CompanyInfo company={item} />
          </Link>
        );
      },
      sort: (items) => {
        return items.sort((a, b) => {
          return a.name.localeCompare(b.name); // Сортировка по имени в алфавитном порядке
        });
      },
    },
    {
      width: 300,
      title: "Регион",
      value: "region",
      render: ({ item }) => (
        <div>
          <p className="text-[16px] font-extrabold leading-[24px] text-[#3C4858]">
            {item.country.name}
          </p>
          <p className="text-[12px] font-medium leading-[16px] text-[#8492A6]">
            {item.region.name}
          </p>
        </div>
      ),
      sort: (items) => {
        const sortf = (a: Company, b: Company) => {
          console.log(a.country > b.country)
          console.log(a.country < b.country)
          if(a.country === b.country){
            return a.region.name.localeCompare(b.region.name)
          }
          return   a.country.name.localeCompare(b.country.name)
        };
        return items.sort((a, b) => sortf(a, b));
      },
    },
  ];

  return (
    <List<Company>
      cols={cols}
      list={companies}
      defaultSort="name"
      onFavorite={(company, value) => {
        const comp = companies.find((c) => company.id == c.id)
        if(comp){
          setCompanies(
            companies.map((c) =>
              c.id === comp.id ? { ...c, isFavorite: value } : c,
            ),
          );
          setFavorite({ value, id: company.id });
        }
        
      }}
    />
  );
};

const CompanyInfo: FC<{ company: Company }> = ({ company }) => {
  return (
    <InfoLayout image={company.image} imageFallBack={company.name[0] ?? "E"}>
      <div>
        <p className="text-[16px] font-extrabold leading-[24px] text-[#3C4858]">
          {company.name}
        </p>
      </div>
    </InfoLayout>
  );
};

const CompanyFilter: FC = () => {
  return (
    <FilterLayout>
      <></>
    </FilterLayout>
  );
};
