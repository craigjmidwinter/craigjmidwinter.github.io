import styled from "@emotion/styled";
import Link from "next/link";
import { useRouter } from "next/router";
import Img from "react-optimized-image";
import { useTheme } from "@emotion/react";

const Container = styled.div`
  display: flex;
  background-color: ${props => props.theme.navBarBackground};
  height: 8.5rem;
  justify-content: space-between;
  align-items: center;
`;
const Links = styled.div`
  display: flex;
  height: 100%;
`;
const LinkItem = styled.div`
  font-family: ${props => props.theme.titleFont};
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 3.12rem;
  font-size: 1.25rem;
  height: 100%;
  align-items: center;
  font-weight: ${props => (props.isSelected ? "700" : "400")};
  color: ${props =>
    props.isSelected ? props.theme.accent : props.theme.lightText2};
  ${props =>
    props.isSelected &&
    `::after {
  content: " ";
  border-top: solid ${props.theme.accent} 0.3rem;
  width:5%;
  display:block;
  top:-0.3rem;
  }`}
`;
const navItems = [
  {
    text: "Home",
    link: "/"
  },
  {
    text: "Resume",
    link: "/resume"
  }
  //{
  //text: "Blog",
  //link: "/blog"
  //}
];
const LogoContainer = styled.div`
  color: ${props => props.theme.text};
  font-size: 3rem;
  font-family: ${props => props.theme.titleFont};
  padding-left: 2rem;
`;
const LogoImg = styled(Img)`
  height: 4rem;
`;
export default function NavBar({ preview, children }) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <Container>
      <LogoContainer>Craig J. Midwinter</LogoContainer>
      <Links>
        {navItems.map(item => {
          return (
            <Link href={item.link}>
              <LinkItem isSelected={router.route === item.link}>
                <a>{item.text}</a>
              </LinkItem>
            </Link>
          );
        })}
      </Links>
    </Container>
  );
}
