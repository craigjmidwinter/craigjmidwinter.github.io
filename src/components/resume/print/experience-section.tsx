import styled from '@emotion/styled'

import ReactMarkdown, { ReactNode } from 'react-markdown'
const ExperienceContainer = styled.div`
  padding: 8.6rem;
  border-bottom: solid 2px ${(props) => props.theme.shaded};
  @media print {
    padding: 0.5rem 0rem 0rem;
    border-bottom: none;
  }
`
const ExperienceSubheading = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  vertical-align: top;
  margin: 1rem 0;
  @media print {
    padding: 0;
    margin: 0.25rem 0;
  }
`
const ExperienceTitle = styled.h2`
  margin: 0;
  font-family: 'Poppins';
  font-weight: 700;
  font-size: 2.5rem;
  @media print {
    font-size: 1.25rem;
  }
`
const ExperienceCompany = styled.h3`
  margin: 0;
  color: #ff4a57;
  font-family: 'Poppins';
  font-weight: 400;
  font-size: 1.375rem;
  @media print {
    font-size: 1.15rem;
    color: #555;
  }
`
const ExperienceTerm = styled.div`
  font-family: 'Poppins';
  font-weight: 400;
  font-size: 1.375rem;
  @media print {
    font-size: 1rem;
    padding-right: 1rem;
  }
`
const ExperienceTech = styled.div`
  font-family: 'SegoeUI';
  color: ${(props) => props.theme.lightText};
  font-weight: 400;
  font-size: 1.375rem;
  @media print {
    font-size: 0.8rem;
  }
`
const ExperienceBody = styled.div``
type ExperienceProps = {
  children: string
  company: string
  title: string
  term?: string
  tech?: string
}
export default function ExperienceSection({
  children,
  company,
  title,
  term,
  tech,
}: ExperienceProps) {
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
