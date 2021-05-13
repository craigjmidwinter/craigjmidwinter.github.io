import styled from "@emotion/styled";
import Footer from "../components/footer";
import Meta from "../components/meta";

const PopOfColour = styled.div`
  width: 100%;
  background-color: ${props => props.theme.accent};
  height: 1rem;
  position: absolute;
  top: 0;
  left: 0;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export default function Layout({ preview, children }) {
  return (
    <>
      <PopOfColour />
      <Meta />

      <Container>
        <main>{children}</main>
      </Container>
      <Footer />
    </>
  );
}
