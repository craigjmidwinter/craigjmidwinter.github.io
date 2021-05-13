import Img from "react-optimized-image";
import styled from "@emotion/styled";

const IntroHeader = styled.div`
  display: flex;
  padding: 1rem;
`;
const AvatarContainer = styled.div`
  max-width: 25%;
  margin: 1rem;
`;

const IntroAvatar = styled(Img)`
  max-height: 20rem;
  max-width: 100%;
  border-radius: 50%;
  border-style: solid;
  border-color: #000;
  border-width: 0.5rem;
  background-color: #1f1a4d;
`;
const IntroTextContainer = styled.div`
  text-align: right;
  vertical-align: middle;
`;
const IntroBody = styled.div`
  font-family: CabinVariable;
  font-size: 1.25rem;
`;
const HeaderText = styled.h1`
  font-size: 4rem;
`;

export default function Intro() {
  return (
    <IntroHeader>
      <AvatarContainer>
        <IntroAvatar src={require("../images/avatar.svg")} />
      </AvatarContainer>
      <IntroTextContainer>
        <HeaderText>Craig J. Midwinter</HeaderText>
        <IntroBody>
          Experienced Developer who specializes in quickly adapting to new
          languages and tools, and developing solutions in challenging problem
          domains
        </IntroBody>
      </IntroTextContainer>
    </IntroHeader>
  );
}
