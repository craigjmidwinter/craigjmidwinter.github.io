import styled from '@emotion/styled'

import ReactMarkdown from 'react-markdown'
const ExperienceContainer = styled.div `
  padding: 8.6rem;
  border-bottom: solid 2px ${(props) => (props.theme as any).shaded};
`;
const ExperienceSubheading = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  vertical-align: top;
  margin: 1rem 0;
`
const ExperienceTitle = styled.h2`
  margin: 0;
  font-family: 'Poppins';
  font-weight: 700;
  font-size: 2.5rem;
`
const ExperienceCompany = styled.h3`
  margin: 0;
  color: #ff4a57;
  font-family: 'Poppins';
  font-weight: 400;
  font-size: 1.375rem;
`
const ExperienceTerm = styled.div`
  font-family: 'Poppins';
  font-weight: 400;
  font-size: 1.375rem;
`
const ExperienceTech = styled.div `
  font-family: 'SegoeUI';
  color: ${(props) => (props.theme as any).lightText};
  font-weight: 400;
  font-size: 1.375rem;
`;
const ExperienceBody = styled.div``

export default function ExperienceSection({
  children,
  company,
  title,
  term,
  tech,
}) {
  return (
    <ExperienceContainer>
      <ExperienceSubheading>
        <ExperienceCompany>{company}</ExperienceCompany>
        {term && <ExperienceTerm>{term}</ExperienceTerm>}
      </ExperienceSubheading>
      <ExperienceTitle>{title}</ExperienceTitle>
      {tech && <ExperienceTech>{tech}</ExperienceTech>}

      <ExperienceBody>
        <ReactMarkdown>{children}</ReactMarkdown>
      </ExperienceBody>
    </ExperienceContainer>
  )
}
