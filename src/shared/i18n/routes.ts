import { z } from "zod";

export const RouteSchema = z.enum([
  "employee",
  "company",
  "resume",
  "",
] as const);
export type Route = typeof RouteSchema._type;

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
};

export const getRoute = (routeKey: string, locale: keyof RoutesI18N[Route]) => {
  const validatedRouteKey = RouteSchema.safeParse(routeKey);

  if (validatedRouteKey.success) {
    const route = routes[validatedRouteKey.data][locale];
    return route;
  } else {
    console.log("invalid route:", routeKey);
    return routeKey;
  }
};
