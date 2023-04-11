//created by talbert herndon

import { CssBaseline } from "@mui/material";
import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        type="text/javascript"
      />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
