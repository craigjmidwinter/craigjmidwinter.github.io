import styled from "@emotion/styled";
const Container = styled.div`
  max-width: 960px;
`;
export default function({ children }) {
  return <Container>{children}</Container>;
}
