import { useSession } from "next-auth/react";
import { LoginCard } from "~/shared/components/auth/loginCard";
import { cn } from "~/shared/utils";

export default function Login() {
  return (
    <div
      className={cn(
        "w-[100svw]",
        "h-[100svh]",
        "flex",
        "items-center",
        "justify-center",
      )}
    >
      <LoginCard />
    </div>
  );
}
