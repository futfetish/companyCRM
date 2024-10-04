import { LoginForm } from "~/shared/components/auth/loginForm";

import { cn } from "~/shared/utils";

export default function Login() {
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
      <LoginForm />
    </div>
  );
}
