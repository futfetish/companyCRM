import { type Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import App, { AppContext, type AppType } from "next/app";

import { api } from "~/shared/utils/api";

import "~/styles/globals.css";
import { AppLayout } from "~/features/layout/app";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </SessionProvider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext;

  const session = await getSession({ req: ctx.req });

  if (
    session == null &&
    !(ctx.req?.url?.startsWith("/login") || ctx.req?.url?.startsWith("/admin"))
  ) {
    if (ctx.res) {
      ctx.res.writeHead(302, { Location: "/login" });
      ctx.res.end();
    } else if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }

  const appProps = await App.getInitialProps(appContext);

  return { session, ...appProps };
};

export default api.withTRPC(MyApp);
