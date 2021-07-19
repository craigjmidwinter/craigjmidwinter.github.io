import styled from '@emotion/styled'
import { HeadingText, SectionHeading } from '../section-header'

const Container = styled.div `
  display: flex;
  justify-content: space-between;
  background-color: ${(props) => (props.theme as any).shaded};
`;
const InfoContainer2 = styled.div `
  width: 33%;
  padding: 8rem;
  font-size: 1.25rem;
  color: ${(props) => (props.theme as any).lightText3};
`;
const InfoContainer = styled.div `
  width: 33%;
  padding: 8rem;
  flex-direction: column;
  font-size: 1.25rem;
  color: ${(props) => (props.theme as any).lightText3};
`;

export default function LandingHero() {
  return (
    <Container>
      <InfoContainer>
        <SectionHeading>Let&apos;s get things moving!</SectionHeading>
        <HeadingText>Stop treading water.</HeadingText>
        Whether you are spinning your tires trying to get a project off the
        ground, or struggling to find the traction you need to hit your next big
        milestone, let me help provide you and your team with the traction you
        need, when you need it.
      </InfoContainer>
      <InfoContainer2>
        <HeadingText>Let&apos;s talk!</HeadingText>
        I&apos;m ready to discuss your project! Email me at
        craig.j.midwinter@gmail.com, or check out my resume to learn more about
        me.
      </InfoContainer2>
    </Container>
  )
}
