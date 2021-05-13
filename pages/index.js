import Container from "../components/container";
import { getAllExperiences } from "../lib/api";
import Intro from "../components/intro";
import Layout from "../components/layout";
import Head from "next/head";
import ResumeBody from "../components/resume-body";
import ReactGA from "react-ga";

export default function Index({ experiences }) {
  ReactGA.initialize("UA-131210782-1");
  ReactGA.pageview("/");
  return (
    <>
      <Layout>
        <Head>
          <title>Craig J. Midwinter - Full Stack Developer</title>
        </Head>
        <Container>
          <Intro />
          <ResumeBody experiences={experiences}></ResumeBody>
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const experiences = getAllExperiences([
    "title",
    "start",
    "end",
    "sortDate",
    "company",
    "content",
    "tech"
  ]);

  return {
    props: { experiences }
  };
}
