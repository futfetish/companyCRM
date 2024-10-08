import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  EmploymentStatus,
  EmploymentType,
  MaritalStatus,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const employeeRouter = createTRPCRouter({
  select: publicProcedure
    .input(
      z.object({
        companyIds: z.array(z.number()).optional(), // Массив companyId
        positionIds: z.array(z.number()).optional(), // Массив positionId
        types: z.array(z.nativeEnum(EmploymentType)).optional(), // Массив employment type
        isFavorite: z.boolean().optional(), // Фильтр по isFavorite
        status: z.array(z.nativeEnum(EmploymentStatus)).optional(), // Массив статусу
        maritalStatuses: z.array(z.nativeEnum(MaritalStatus)).optional(), // Массив maritalStatus
      }),
    )
    .query(async ({ input, ctx }) => {
      const {
        companyIds,
        positionIds,
        types,
        isFavorite,
        status,
        maritalStatuses,
      } = input;

      const employees = await ctx.db.employee.findMany({
        where: {
          ...(companyIds && { companyId: { in: companyIds } }), // Фильтр по companyId
          ...(positionIds && { positionId: { in: positionIds } }), // Фильтр по positionId
          ...(types && { type: { in: types } }), // Фильтр по типам занятости
          ...(isFavorite !== undefined && { isFavorite }), // Фильтр по isFavorite
          ...(status && { status: { in: status } }), // Фильтр по статусу
          ...(maritalStatuses && { maritalStatus: { in: maritalStatuses } }), // Фильтр по maritalStatus
        },
        include: {
          company: true, // Подключаем информацию о компании
          position: true, // Подключаем информацию о должности
        },
      });

      if(!employees){
        throw new TRPCError({
          code : 'BAD_REQUEST',
          message: "user with the same name already exists",
        });
      }

      return employees;
    }),
});