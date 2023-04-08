//created by talbert herndon

import { wrapper } from "../store/store";
import { SessionProvider, useSession } from "next-auth/react";
import mixpanel from "mixpanel-browser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Router from "next/router";
import { useEffect } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Script from "next/script";

mixpanel.init("73c9792296d221b289d08ad0b7f2639d", { debug: true });

function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);
  useEffect(() => {
    Router.events.on("routeChangeStart", NProgress.start);
    Router.events.on("routeChangeComplete", NProgress.done);
    Router.events.on("routeChangeError", NProgress.done);
    return () => {
      Router.events.off("routeChangeStart", NProgress.start);
      Router.events.off("routeChangeComplete", NProgress.done);
      Router.events.off("routeChangeError", NProgress.done);
    };
  }, []);
  return getLayout(
    <>
      {" "}
      <SessionProvider session={session} baseUrl="api/auth/">
        {Component.auth ? (
          <Auth>
            {" "}
            <Component {...pageProps} />
            <ToastContainer
              style={{ zIndex: 100000 }}
              position="bottom-left"
              autoClose={1225}
            />
          </Auth>
        ) : (
          <>
            {" "}
            <Component {...pageProps} />
            <ToastContainer
              style={{ zIndex: 100000 }}
              position="bottom-left"
              autoClose={1225}
            />
          </>
        )}
      </SessionProvider>
    </>
  );
}
function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
export default wrapper.withRedux(App);
