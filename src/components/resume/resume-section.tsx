import styled from '@emotion/styled'

const Section = styled.div `
  background-color: ${(props) => (props as any).shaded ? (props.theme as any).shaded : (props.theme as any).white};
`;
const HeaderContainer = styled.div `
  padding: 0 8rem;
  ${(props) => (props as any).rightAlign && 'text-align: right;'}
`;
const SectionHeader = styled.h1 `
  font-size: 3.5rem;
  display: inline-block;
  ${(props) => (props as any).bulletHeading
    ? `
::before{
content: '- ';
color: ${(props.theme as any).accent};
}
`
    : ' '}
  ${(props) => (props as any).underlineHeading
    ? `
::after{
content: ' ';
width: 50%;
border-bottom: solid ${(props.theme as any).accent} 4px;
display:block;
}
`
    : ''}
`;
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
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element[]; shaded: boolean; }' i... Remove this comment to see the full error message
    <Section shaded={shaded}>
      {/* @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; rightAlign: boolean; }'... Remove this comment to see the full error message */}
      <HeaderContainer rightAlign={rightAlignHeader}>
        <SectionHeader
          // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: any; bulletHeading: boolean; und... Remove this comment to see the full error message
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
