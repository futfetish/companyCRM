import { FC, ReactNode } from "react";
import { cn } from "~/shared/utils/cn";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

type NavIcon = "person" | "circle" | "company";

interface Nav {
  title: string;
  href: string;
  icon: NavIcon;
}

export const NavBarLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const nav: Nav[] = [
    {
      title: "Люди",
      href: "/employee",
      icon: "person",
    },
    {
      title: "Компании",
      href: "/company",
      icon: "company",
    },
  ];

  const router = useRouter();

  const leaveNav: Nav = {
    title: "Выйти",
    href: "#",
    icon: "circle",
  };

  return (
    <div className={cn("flex h-full w-full")}>
      <div
        className={cn(
          "transition-width absolute flex h-full w-[104px] flex-shrink-0 flex-col gap-[32px] overflow-hidden bg-black p-[34px] duration-100 ease-in-out hover:w-[336px]",
        )}
      >
        <nav className="flex grow flex-col justify-between gap-[32px] pb-[32px]">
          <div className="flex flex-col gap-[32px]">
            {nav.map((nav, index) => (
              <NavButton
                active={router.pathname.startsWith(nav.href)}
                key={index}
                nav={nav}
              />
            ))}
          </div>

          <div onClick={() => signOut()}>
            <NavButton key={"leave"} nav={leaveNav} />
          </div>
        </nav>
      </div>
      <div className="ml-[104px] h-full grow"> {children}</div>
    </div>
  );
};

const NavButton: FC<{ nav: Nav; active?: boolean }> = ({
  nav,
  active = false,
}) => {
  const navIcons: Record<NavIcon, ReactNode> = {
    person: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
      </svg>
    ),
    company: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" />
      </svg>
    ),
    circle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="36"
        height="36"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" fill="currentColor" />
      </svg>
    ),
  };

  return (
    <Link
      href={nav.href}
      className={cn(
        "m-[-10px] flex items-center gap-[36px] p-[10px] hover:text-[#5c6570]",
        active ? "!text-white" : "text-[#3C4858]",
      )}
    >
      <div className="h-[36px] w-[36px] flex-shrink-0">
        {navIcons[nav.icon]}
      </div>
      <div className="text-[16px]">
        {" "}
        <strong> {nav.title} </strong>{" "}
      </div>
    </Link>
  );
};
