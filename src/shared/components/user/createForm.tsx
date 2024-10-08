import { FC } from "react";
import { Input } from "~/shared/ui/input";
import { api } from "~/shared/utils/api";
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
import { cn } from "~/shared/utils/cn";

const formSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .refine((value) => !/\s/.test(value), {
      message: "Username cannot contain spaces",
    }),

  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters" })
    .refine((value) => !/\s/.test(value), {
      message: "Password cannot contain spaces",
    }),
});

export const UserCreateForm: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const { mutate, isPending } = api.user.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (data) => {
      if (data.data?.code == "CONFLICT") {
        form.setError("username", {
          type: "manual",
          message: data.message,
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: data.message,
        });
      }
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate({ name: data.username, password: data.password });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="relative space-y-8 w-[400px]"
      >
        <h1 className={cn("text-center", "text-[30px]")}>Create User</h1>
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
        <FormMessage className="absolute w-full text-center top-[15px]">
          {form.formState.errors.root?.message}
        </FormMessage>
        <Button
          disabled={
            Object.keys(form.formState.errors).filter((key) => key !== "root")
              .length > 0 || isPending
          }
          className="w-[100%]"
          type="submit"
        >
          {isPending ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <p> Submit </p>
          )}
        </Button>
      </form>
    </Form>
  );
};
