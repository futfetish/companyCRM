import { UserCreateForm } from "~/shared/components/user/createForm";
import { cn } from "~/shared/utils";

export default function CreateUser() {
  return (
    <div
      className={cn(
        "w-[100svw]",
        "h-[100svh]",
        "flex",
        "pt-[10%]",
        "justify-center",
      )}
    >
      <UserCreateForm />
    </div>
  );
}
