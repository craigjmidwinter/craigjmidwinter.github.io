import '@fontsource/noto-serif/index.css'
import '@fontsource/cabin/variable.css'
import '@fontsource/poppins'
import '@fontsource/poppins/700.css'
import '@fontsource/poppins/800.css'
import '@fontsource/poppins/900.css'
import { ThemeProvider, useTheme } from '@emotion/react'
import { darkTheme } from '../themes/dark'

import { Global, css } from '@emotion/react'
const GlobalStyles = () => {
  const theme = useTheme()
  return (
    <Global
      styles={css`
        @font-face {
          font-family: SegoeUI;
          src: local('Segoe UI Light'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff2)
              format('woff2'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.woff)
              format('woff'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/light/latest.ttf)
              format('truetype');
          font-weight: 100;
        }

        @font-face {
          font-family: SegoeUI;
          src: local('Segoe UI Semilight'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff2)
              format('woff2'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.woff)
              format('woff'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semilight/latest.ttf)
              format('truetype');
          font-weight: 200;
        }

        @font-face {
          font-family: SegoeUI;
          src: local('Segoe UI'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff2)
              format('woff2'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.woff)
              format('woff'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/normal/latest.ttf)
              format('truetype');
          font-weight: 400;
        }

        @font-face {
          font-family: SegoeUI;
          src: local('Segoe UI Bold'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff2)
              format('woff2'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.woff)
              format('woff'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/bold/latest.ttf)
              format('truetype');
          font-weight: 600;
        }

        @font-face {
          font-family: SegoeUI;
          src: local('Segoe UI Semibold'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff2)
              format('woff2'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.woff)
              format('woff'),
            url(//c.s-microsoft.com/static/fonts/segoe-ui/west-european/semibold/latest.ttf)
              format('truetype');
          font-weight: 700;
        }
        html {
          font-size: 12px;
        }
        ,
        body {
          background: ${(theme as any).background};
          margin: 0px;
          font-family: 'SegoeUI';
          color: ${(theme as any).text};
          position: absolute;
          width: 100%;
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: 'Poppins';
          font-weight: 700;
        }

        @media print {
          body {
            background: white !important;
          }
          div {
            background: white !important;
            color: black !important;
          }
        }
      `}
    />
  )
}

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}
