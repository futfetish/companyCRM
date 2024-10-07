import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, password } = input;

      const existUser = await ctx.db.user.findUnique({
        where: {
          name,
        },
      });

      if (existUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "user with the same name already exists",
        });
      }

      if (name.trim().length < 3) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username must be at least 3 characters',
        });
      }
    
      if (/\s/.test(name.trim())) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username cannot contain spaces',
        });
      }
    
      // Валидация password
      if (password.trim().length < 3) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Password must be at least 3 characters',
        });
      }
    
      if (/\s/.test(password.trim())) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Password cannot contain spaces',
        });
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        const hashedPassword = await bcrypt.hash(password, 10);

        if(typeof hashedPassword != 'string'){
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error while hashing password`,
          });
        }
      
        const user = await ctx.db.user.create({
          data : {
            name,
            password : hashedPassword
          }
        })

        return user
        
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Error while hashing password: ${error.message}`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unknown error occurred while hashing password",
        });
      }
      
    }),
});
