import { CompanyType, Country, region, WorkSchedule } from "@prisma/client";
import { createEvent, createStore, sample } from "effector";
import { Company as CompanyI } from "@prisma/client";

interface Company extends CompanyI {
  region: region;
  country: Country;
  workSchedule: WorkSchedule;
}
export const setCompanies = createEvent<Company[]>();
export const $companies = createStore<Company[]>([]).on(
  setCompanies,
  (_, companies) => companies,
);

export const $filteredCompanies = createStore<Company[]>([]);

export const setCompanyType = createEvent<CompanyType>();
export const $companyType = createStore<CompanyType>("myCompanies").on(
  setCompanyType,
  (_, type) => type,
);

sample({
  source: {
    companies: $companies,
    type : $companyType
  },
  clock: [setCompanies , setCompanyType],
  fn: ({companies, type}) => {
    return companies.filter((company) => {
        const typeFilter = company.type == type
        return typeFilter
    })
  },
  target: $filteredCompanies,
});
