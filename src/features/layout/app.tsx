import { FC, ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { cn } from "~/shared/utils";
import Head from "next/head";

export const AppLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Head>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"  />
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,200..1000&display=swap" rel="stylesheet" />

      </Head>
      <div
        className={cn(
          GeistSans.className,
          "h-[100svh] w-[100svw] bg-[#F9FAFC]",
        )}
      >
        {children}
      </div>
    </>
  );
};
