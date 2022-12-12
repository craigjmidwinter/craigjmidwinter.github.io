import Img from 'react-optimized-image'
import styled from '@emotion/styled'

const IntroHeader = styled.div`
  display: flex;
  justify-content: center;
  padding: 10.75rem 0;
  @media print {
    padding: 0rem 0;
  }
`
const IntroRow = styled.div`
  display: flex;
  width: 75%;
  justify-content: space-around;
  @media print {
    width: 100%;
  }
`
const IntroTextContainer = styled.div`
  text-align: left;
  vertical-align: middle;
  max-width: 65%;
  height: 100%;
 display: flex;
    flex-direction: column;
    justify-content: center;
}
`
const IntroName = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.75rem;
  font-weight: 900;
`
const IntroEmail = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1.75rem;
`
const IntroBody = styled.div`
  font-size: 1.25rem;
  max-width: 35rem;
  color: #b1acac;
`
const AvatarContainer = styled.div`
  margin: 1rem;
  flex: 1;
  max-width: 28.25rem;
  @media print {
    max-width: 14rem;
  }
`
const Avatar = styled.div`
  :before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  position: relative;
`

const IntroAvatar = styled(Img)`
  width: 100%;
  height: 100%;
  z-index: 2;
  position: absolute;
  top: 0;
  border-radius: 1.5rem;
`
const Box1 = styled.div`
  background-color: #352d95;
  opacity: 0.5;
  transform: rotate(345deg);
  border-radius: 1.5rem;
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
`
const Box2 = styled.div`
  background-color: #7067d4;
  opacity: 0.3;
  transform: rotate(330deg);
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
  border-radius: 1.5rem;
`
export interface IntroProps {
  email: string
  introBody: string
}
export default function Intro({ email, introBody }: IntroProps) {
  return (
    <IntroHeader>
      <IntroRow>
        <IntroTextContainer>
          <IntroName>Craig J. Midwinter</IntroName>
          <IntroBody>{introBody}</IntroBody>
          <IntroEmail>{email}</IntroEmail>
        </IntroTextContainer>
        <AvatarContainer>
          <Avatar>
            <Box1 />
            <Box2 />
            <IntroAvatar src={require('../../../images/avatar.svg')} />
          </Avatar>
        </AvatarContainer>
      </IntroRow>
    </IntroHeader>
  )
}
