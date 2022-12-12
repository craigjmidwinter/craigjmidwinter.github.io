import { Experience } from '../../lib/api'
import { Project } from '../../lib/api/projects'
import { Volunteer } from '../../lib/api/volunteer'

export interface ResumeProps {
  experiences: Experience[]
  projects: Project[]
  introBody: string
  email: string
  pageTitle: string
  summary: string
  volunteerExperience: Volunteer[]
  funFacts: string
}
