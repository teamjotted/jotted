import "@/styles/globals.css";
import { wrapper } from "../store/store";
import { SessionProvider } from "next-auth/react";

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      {" "}
      <SessionProvider session={session} baseUrl="api/auth/">
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default wrapper.withRedux(App);
