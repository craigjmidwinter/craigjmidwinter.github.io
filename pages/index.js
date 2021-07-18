import Container from '../components/container'
import { getAllPosts } from '../lib/api/blog'
import Layout from '../components/layout'
import Head from 'next/head'
import ReactGA from 'react-ga'
import LandingHero from '../components/landing/hero'
import CallToAction from '../components/landing/cta'
import BlogBlock from '../components/landing/blog'

export default function Index({ posts }) {
  ReactGA.initialize('UA-131210782-1')
  ReactGA.pageview('/')
  return (
    <>
      <Layout>
        <Head>
          <title>Craig J. Midwinter - Full Stack Developer</title>
        </Head>
        <Container>
          <LandingHero />
          <CallToAction />
          <BlogBlock posts={posts} />
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts(['title', 'date_published', 'slug']).slice(0, 3)

  return {
    props: { posts },
  }
}
