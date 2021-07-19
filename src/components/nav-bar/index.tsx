import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'

const Container = styled.div `
  display: flex;
  background-color: ${(props) => (props.theme as any).navBarBackground};
  height: 8.5rem;
  justify-content: space-between;
  align-items: center;
`;
const Links = styled.div`
  display: flex;
  height: 100%;
`
const LinkItem = styled.div `
  font-family: ${(props) => (props.theme as any).titleFont};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 3.12rem;
  font-size: 1.25rem;
  height: 100%;
  align-items: center;
  font-weight: ${(props) => ((props as any).isSelected ? '700' : '400')};
  color: ${(props) => (props as any).isSelected ? (props.theme as any).accent : (props.theme as any).lightText2};
  ${(props) => (props as any).isSelected &&
    `::after {
  content: " ";
  border-top: solid ${(props.theme as any).accent} 0.3rem;
  width:5%;
  display:block;
  top:-0.3rem;
  }`}
`;
const navItems = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'Resume',
    link: '/resume',
  },
  //{
  //text: "Blog",
  //link: "/blog"
  //}
]
const LogoContainer = styled.div `
  color: ${(props) => (props.theme as any).text};
  font-size: 3rem;
  font-family: ${(props) => (props.theme as any).titleFont};
  padding-left: 2rem;
`;
export default function NavBar() {
  const router = useRouter()
  return (
    <Container>
      <LogoContainer>Craig J. Midwinter</LogoContainer>
      <Links>
        {navItems.map((item, i) => {
          return (
            <Link href={item.link} key={i}>
              {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; isSelected: boolean; }'... Remove this comment to see the full error message */}
              <LinkItem isSelected={router.route === item.link}>
                <a>{item.text}</a>
              </LinkItem>
            </Link>
          )
        })}
      </Links>
    </Container>
  )
}
