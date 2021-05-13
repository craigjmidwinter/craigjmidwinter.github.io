import "@fontsource/noto-serif/index.css"
import "@fontsource/cabin/variable.css"
import { Global, css } from '@emotion/react'

export default function MyApp({ Component, pageProps }) {
  return (<>
      <Global styles={css`
body {

        background-color: #f3f3f3;
        font-family: "Noto Serif";
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "CabinVariable";
          font-weight: 700;
        }
`}/>
      <Component {...pageProps} />
      </>
  );
}
