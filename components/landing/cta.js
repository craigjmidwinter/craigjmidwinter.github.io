import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${props => props.theme.shaded};
`;
const InfoContainer2 = styled.div`
  width: 33%;
  padding: 8rem;
`;
const InfoContainer = styled.div`
  width: 33%;
  padding: 8rem;
  flex-direction: column;
  font-size: 1.25rem;
  color: ${props => props.theme.lightText5};
`;
const LandingSectionHeading = styled.div`
  font-size: 1.325rem;
  color: ${props => props.theme.accent};
  font-family: ${props => props.theme.titleFont};
  ::before {
    content: "- ";
    color: ${props => props.theme.accent};
  }
`;
const CtaHeading = styled.div`
  font-size: 2.5rem;
  color: ${props => props.theme.lightText4};
  font-family: ${props => props.theme.titleFont};
  font-weight: 700;
`;

export default function LandingHero({ preview, children }) {
  return (
    <Container>
      <InfoContainer>
        <LandingSectionHeading>Let's get things moving!</LandingSectionHeading>
        <CtaHeading>Stop treading water.</CtaHeading>
        Whether you are spinning your tires trying to get a project off the
        ground, or struggling to find the traction you need to hit your next big
        milestone, let me help provide you and your team with the traction you
        need, when you need it.
      </InfoContainer>
      <InfoContainer2></InfoContainer2>
    </Container>
  );
}
