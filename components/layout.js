import styled from '@emotion/styled'
import Footer from './footer'
import Meta from './meta'
import NavBar from './nav-bar'
import { ThemeProvider } from '@emotion/react'
import { darkTheme } from '../themes/dark'

const Container = styled.div`
  display: flex;
  justify-content: center;
`

export default function Layout({ children }) {
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Meta />
        <NavBar></NavBar>

        <Container>
          <main>{children}</main>
        </Container>
        <Footer />
      </ThemeProvider>
    </>
  )
}
