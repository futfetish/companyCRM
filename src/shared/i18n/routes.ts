import { i18n } from "../utils/i18n";

export type Route = "employee" | "company" | "resume" | "" | 'general';

type RoutesI18N = Record<Route, { ru: string }>;

const routes: RoutesI18N = {
  employee: {
    ru: "Люди",
  },
  company: {
    ru: "Компании",
  },
  resume: {
    ru: "Резюме",
  },
  "": {
    ru: "Главная",
  },
  'general' : {
    ru: 'Общий'
  }
};

export const getRoute = (
  routeKey: string,
  locale: keyof RoutesI18N[Route],
) => {
  return i18n(routes , routeKey , locale )
};
