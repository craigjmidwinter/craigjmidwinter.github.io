import styled from '@emotion/styled'
import ResumeSection from './resume-section'
import ExperienceSection from './experience-section'
import ReactMarkdown from 'react-markdown'
import { ResumeProps } from './types'
import { Project } from '../../lib/api/projects'
import { Volunteer } from '../../lib/api/volunteer'

const ResumeContainer = styled.div``
const ParagraphContainer = styled.div`
  padding: 0 8.6rem 8.6rem 8.6rem;
  @media print {
    padding: 0.25rem;
  }
`
type ResumeBodyProps = Pick<
  ResumeProps,
  'experiences' | 'summary' | 'projects' | 'volunteerExperience' | 'funFacts'
>
export default function ResumeBody({
  experiences,
  summary,
  projects,
  volunteerExperience,
  funFacts,
}: ResumeBodyProps) {
  return (
    <ResumeContainer>
      <ResumeSection shaded underlineHeading title="Summary">
        <ParagraphContainer>{summary}</ParagraphContainer>
      </ResumeSection>
      <ResumeSection bulletHeading title="Employment History">
        {experiences.map((experience, i) => {
          return (
            <ExperienceSection
              key={i}
              company={experience.company}
              term={`${experience.start} - ${experience.end}`}
              title={experience.title}
              tech={experience.tech}
            >
              {experience.content}
            </ExperienceSection>
          )
        })}
      </ResumeSection>
   
      <ResumeSection
                     shaded
        bulletHeading
        rightAlignHeader
        title="Volunteer Experience"
      >
        {volunteerExperience.map(
          ({ company, title, content, term }: Volunteer) => {
            return (
              <ExperienceSection company={company} title={title} term={term}>
                {content}
              </ExperienceSection>
            )
          }
        )}
      </ResumeSection>
      <ResumeSection underlineHeading title="Fun Facts">
        <ParagraphContainer>
          <ReactMarkdown>{funFacts}</ReactMarkdown>
        </ParagraphContainer>
      </ResumeSection>
    </ResumeContainer>
  )
}
