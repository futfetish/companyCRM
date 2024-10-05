import { FC, useState } from "react";
import { Input } from "~/shared/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ReloadIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/shared/ui/form";
import { Button } from "~/shared/ui/button";
import { cn } from "../../utils/cn";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Username is required" })
    .refine((value) => !/\s/.test(value), {
      message: "Username cannot contain spaces",
    }),

  password: z
    .string()
    .min(1, { message: "Password is required" })
    .refine((value) => !/\s/.test(value), {
      message: "Password cannot contain spaces",
    }),
});

export const LoginForm: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const result = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (!result) {
      return;
    }

    // Проверка наличия ошибок
    if (result.error) {
      console.log(result.error);

      form.setError("root", {
        type: "manual",
        message: " Invalid login or password",
      });
    } else {
      form.clearErrors("root");
      console.log(result.status);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative w-[400px] space-y-8"
      >
        <h1
          className={cn(
            form.formState.errors.root && "text-destructive",
            "text-center",
            "text-[30px]",
          )}
        >
          Login
        </h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  className={cn(
                    form.formState.errors.username && "border-destructive",
                  )}
                  {...field}
                />
              </FormControl>
              <div className="h-[5px]">
                <FormMessage className="!mt-0 h-0" />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  className={cn(
                    form.formState.errors.password && "border-destructive",
                  )}
                  type="password"
                  {...field}
                />
              </FormControl>
              <div className="h-[5px]">
                <FormMessage className="!mt-0 h-0" />
              </div>
            </FormItem>
          )}
        />
        <FormMessage className="absolute top-[-60px]">
          {form.formState.errors.root?.message}
        </FormMessage>
        <Button
          disabled={
            Object.keys(form.formState.errors).filter((key) => key !== "root")
              .length > 0 || isLoading
          }
          className="w-[100%]"
          type="submit"
        >
          {isLoading ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <p> Submit </p>
          )}
        </Button>
      </form>
    </Form>
  );
};
