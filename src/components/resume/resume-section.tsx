import styled from '@emotion/styled'

const Section = styled.div`
  background-color: ${(props) =>
    props.shaded ? props.theme.shaded : props.theme.white};
`
const HeaderContainer = styled.div`
  padding: 0 8rem;
  ${(props) => props.rightAlign && 'text-align: right;'}
`
const SectionHeader = styled.h1`
  font-size: 3.5rem;
  display: inline-block;
  ${(props) =>
    props.bulletHeading
      ? `
::before{
content: '- ';
color: ${props.theme.accent};
}
`
      : ' '}
  ${(props) =>
    props.underlineHeading
      ? `
::after{
content: ' ';
width: 50%;
border-bottom: solid ${props.theme.accent} 4px;
display:block;
}
`
      : ''}
`
const SectionBody = styled.div`
  font-size: 1.25rem;
`

export default function ResumeSection({
  children,
  title,
  shaded = false,
  bulletHeading = false,
  underlineHeading = false,
  rightAlignHeader = false,
}) {
  return (
    <Section shaded={shaded}>
      <HeaderContainer rightAlign={rightAlignHeader}>
        <SectionHeader
          bulletHeading={bulletHeading}
          underlineHeading={underlineHeading}
        >
          {title}
        </SectionHeader>
      </HeaderContainer>
      <SectionBody>{children}</SectionBody>
    </Section>
  )
}
