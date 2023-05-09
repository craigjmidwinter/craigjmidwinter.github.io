import Container from '../components/container'
import { getAllExperiences } from '../lib/api'
import ReactGA from 'react-ga'
import { Resume } from '../components/resume/resume'
import { getAllProjects } from '../lib/api/projects'
import { getAllVolunteers } from '../lib/api/volunteer'

export default function Index({ experiences, projects, volunteer }) {
  ReactGA.initialize('UA-131210782-1')
  ReactGA.pageview('/resume')
  return (
    <>
      <Resume
        pageTitle={'Craig J. Midwinter - Full Stack Developer'}
        experiences={experiences}
        introBody={
          'Passionate developer who specializes in quickly adapting to new languages and tools, and developing solutions in challenging problem domains, with specific experience building tooling for ML models and Data Science as well as geospatial data visualization'
        }
        summary={
          'Currently primarily working with NodeJS/Typescript with some Go, C# and Python in containerized environments deployed to managed Kubernetes clusters on the back-end, ReactJS on the front-end and using Terraform to manage cloud infrastructure on AWS and Digital Ocean.'
        }
        email={'craig.j.midwinter@gmail.com'}
        projects={projects}
        volunteerExperience={volunteer}
        funFacts={`
- I have been a home automation enthusiast for over a decade. Every light in my house is automated
- I am a huge fan of reality TV and host/produce a podcast about The Real Housewives and other Bravo reality TV shows called "Bravo Outsider"
`}
      />
    </>
  )
}

export async function getStaticProps() {
  const experiences = getAllExperiences([
    'title',
    'start',
    'end',
    'sortDate',
    'company',
    'content',
    'tech',
  ])
  const projects = getAllProjects([
    'title',
    'sortDate',
    'company',
    'content',
    'tech',
  ])
  const volunteer = getAllVolunteers([
    'title',
    'sortDate',
    'company',
    'content',
    'term',
  ])

  return {
    props: { experiences, projects, volunteer },
  }
}
