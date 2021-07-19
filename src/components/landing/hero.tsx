import styled from '@emotion/styled'
import Img from 'react-optimized-image'
import Link from 'next/link'
import { ArrowNarrowRight } from '@emotion-icons/heroicons-outline/ArrowNarrowRight'
import { Linkedin } from '@emotion-icons/boxicons-logos/Linkedin'
import { Github } from '@emotion-icons/boxicons-logos/Github'
import { Gitlab } from '@emotion-icons/boxicons-logos/Gitlab'

const IntroAvatar = styled(Img)`
  width: 100%;
  height: 100%;
`

const AvatarContainer = styled.div`
  width: 25%;
  padding: 8rem;
`
const InfoContainer = styled.div`
  height: 100%;
  max-width: 50%;
  padding: 8rem;
  flex-direction: column;
`
const BadgeContainer = styled.div`
  width: 2rem;
  color: ${(props) => props.theme.text};
  border: solid ${(props) => props.theme.accent} 1px;
  border-radius: 50%;
  padding: 1rem;
  margin-right: 1rem;
`
const BadgeRow = styled.div`
  display: flex;
`
const ButtonContainer = styled.div`
  display: inline-block;
  margin-top: 4.25rem;
  a {
    text-decoration: none;
  }
`
const HeroTitle = styled.h1`
  font-size: 3.81rem;
`
const HeroText = styled.div`
  color: ${(props) => props.theme.lightText3};
  font-size: 1.25rem;
`
const TopBlock = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`
const BottomBlock = styled.div`
  display: flex;
`
const HeroButtonText = styled.div`
  display: inline;
`
const HeroButton = styled.div`
  color: ${(props) => props.theme.text};
  padding: 1.625rem 3rem 1.625rem 4.5rem;
  border: solid ${(props) => props.theme.accent} 1px;
  border-radius: 4rem;
  font-size: 1.25rem;
  display: inline-block;
`
const Arrow = styled(ArrowNarrowRight)`
  padding-left: 3rem;
  height: 2rem;
`

const socialLinks = [
  {
    icon: Linkedin,
    link: 'https://www.linkedin.com/in/craig-midwinter-b26193155/',
  },
  {
    icon: Github,
    link: 'https://github.com/craigjmidwinter',
  },
  {
    icon: Gitlab,
    link: 'https://gitlab.com/midwinter',
  },
]

const IconBadge = ({ icon: Icon, link }) => {
  return (
    <Link href={link}>
      <a>
        <BadgeContainer>
          <Icon />
        </BadgeContainer>
      </a>
    </Link>
  )
}

export default function LandingHero() {
  return (
    <>
      <TopBlock>
        <InfoContainer>
          <BadgeRow>
            {socialLinks.map((social, i) => (
              <IconBadge key={i} {...social} />
            ))}
          </BadgeRow>
          <HeroTitle>Craig J. Midwinter</HeroTitle>
          <HeroText>
            Experienced developer who specializes in quickly adapting to new
            languages and tools and developing solutions in challenging problem
            domains
          </HeroText>
          <ButtonContainer>
            <Link href="/resume">
              <a>
                <HeroButton>
                  <HeroButtonText>View Resume</HeroButtonText>
                  <Arrow />
                </HeroButton>
              </a>
            </Link>
          </ButtonContainer>
        </InfoContainer>
        <AvatarContainer>
          <IntroAvatar src={require('../../images/avatar-alpha.svg')} />
        </AvatarContainer>
      </TopBlock>
      <BottomBlock></BottomBlock>
    </>
  )
}
