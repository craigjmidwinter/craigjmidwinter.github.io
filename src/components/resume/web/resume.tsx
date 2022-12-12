import Container from '../../container'
import Intro from './intro'
import Layout from '../../layout'
import Head from 'next/head'
import ResumeBody from './resume-body'
import { ResumeProps } from '../types'

export function WebResume({
  experiences,
  pageTitle,
  introBody,
  email,
  summary,
  projects,
  volunteerExperience,
  funFacts,
}: ResumeProps) {
  return (
    <>
      <Layout>
        <Head>
          <title>{pageTitle}</title>
        </Head>
        <Container>
          <Intro introBody={introBody} email={email} />
          <ResumeBody
            experiences={experiences}
            summary={summary}
            projects={projects}
            volunteerExperience={volunteerExperience}
            funFacts={funFacts}
          ></ResumeBody>
        </Container>
      </Layout>
    </>
  )
}
