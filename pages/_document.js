import Document, { Html, Head, Main, NextScript } from "next/document";
import { ThemeProvider } from "@emotion/react";
import { lightTheme } from "../themes/light";
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <ThemeProvider theme={lightTheme}>
          <Head>
          </Head>
          <body>
              <Main />
              <NextScript />
          </body>
        </ThemeProvider>
      </Html>
    );
  }
}
