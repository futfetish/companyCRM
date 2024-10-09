import { CompanyType, EmploymentType } from "@prisma/client";
import { i18n } from "../utils/i18n";

type EmploymentTypeI18n =  Record< EmploymentType , {ru : string} >

const employmentTypeI18n : EmploymentTypeI18n = {
    staff: { ru: "Штатный" },
    piecework: { ru: "Сдельный" },
    candidate: { ru: "Кандидат" },
    archive: { ru: "Архив" },
    partner: { ru: "Партнер" },
    other: { ru: "Прочее" },

}

export const getEmploymentType = ( employmentTypeKey : EmploymentType  , locale : keyof EmploymentTypeI18n[EmploymentType] ) => {
    return i18n( employmentTypeI18n , employmentTypeKey , locale  )
}

type CompanyTypeI18n = Record<CompanyType, { ru: string }>;

// Локализация для CompanyType
const companyTypeI18n: CompanyTypeI18n = {
    myCompanies: { ru: "Мои компании" },
    partner: { ru: "Партнер" },
    client: { ru: "Клиент" },
    customer: { ru: "Заказчик" },
    archive: { ru: "Архив" },
    other: { ru: "Другое" },
};

// Функция для получения локализованного значения
export const getCompanyType = (companyTypeKey: CompanyType, locale: keyof CompanyTypeI18n[CompanyType]) => {
    return i18n(companyTypeI18n, companyTypeKey, locale);
};