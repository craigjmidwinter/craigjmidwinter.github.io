import Img from "react-optimized-image";
import styled from "@emotion/styled";

const IntroHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 10.75rem 0;
  background: #fff;
`;
const IntroRow = styled.div`
  display: flex;
  width: 75%;
  justify-content: space-around;
`;
const IntroTextContainer = styled.div`
  text-align: left;
  vertical-align: middle;
  max-width: 65%;
  height: 100%;
 display: flex;
    flex-direction: column;
    justify-content: center;
}
`;
const IntroName = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.75rem;
`;
const IntroEmail = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.75rem;
`;
const IntroBody = styled.div`
  font-size: 1.25rem;
  max-width: 35rem;
  color: #b1acac;
`;
const AvatarContainer = styled.div`
  margin: 1rem;
  flex: 1;
  max-width: 28.25rem;
`;
const Avatar = styled.div`
  :before {
    content: "";
    display: block;
    padding-top: 100%;
  }
  position: relative;
`;

const IntroAvatar = styled(Img)`
  width: 100%;
  height: 100%;
  background-color: #1f1a4d;
  z-index: 2;
  position: absolute;
  top: 0;
`;
const Box1 = styled.div`
  background-color: #352d95;
  opacity: 0.5;
  transform: rotate(345deg);
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
`;
const Box2 = styled.div`
  background-color: #7067d4;
  opacity: 0.3;
  transform: rotate(-45deg);
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
`;

export default function Intro() {
  return (
    <IntroHeader>
      <IntroRow>
        <IntroTextContainer>
          <IntroName>Craig J. Midwinter</IntroName>
          <IntroBody>
            Experienced Developer who specializes in quickly adapting to new
            languages and tools, and developing solutions in challenging problem
            domains.
          </IntroBody>
          <IntroEmail>craig.j.midwinter@gmail.com</IntroEmail>
        </IntroTextContainer>
        <AvatarContainer>
          <Avatar>
            <Box1 />
            <Box2 />
            <IntroAvatar src={require("../images/avatar.svg")} />
          </Avatar>
        </AvatarContainer>
      </IntroRow>
    </IntroHeader>
  );
}
