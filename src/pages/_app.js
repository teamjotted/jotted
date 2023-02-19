import { wrapper } from "../store/store";
import { SessionProvider } from "next-auth/react";
import mixpanel from "mixpanel-browser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

mixpanel.init("73c9792296d221b289d08ad0b7f2639d", { debug: true });

function App({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout || ((page) => page);

  return getLayout(
    <>
      {" "}
      <SessionProvider session={session} baseUrl="api/auth/">
        <Component {...pageProps} />
        <ToastContainer
          style={{ zIndex: 100000 }}
          position="bottom-left"
          autoClose={1250}
        />
      </SessionProvider>
    </>
  );
}

export default wrapper.withRedux(App);
