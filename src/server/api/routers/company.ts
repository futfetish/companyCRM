import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const companyRouter = createTRPCRouter({
    setFavorite: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        value: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, value } = input;
      const company = await ctx.db.company.findUnique({
        where: {
          id,
        },
      });

      if (!company) {
        throw new TRPCError({
          message: "404",
          code: "NOT_FOUND",
        });
      }

      const updatedCompany = await ctx.db.employee.update({
        where: {
          id,
        },
        data: {
          isFavorite: value,
        },
      });

      if (!updatedCompany) {
        throw new TRPCError({
          message: "404",
          code: "BAD_REQUEST",
        });
      }

      return updatedCompany;
    }),
})