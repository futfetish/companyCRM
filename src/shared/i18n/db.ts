import { EmploymentType } from "@prisma/client";
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

