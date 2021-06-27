import Container from "../components/container";
import { getAllExperiences } from "../lib/api";
import Intro from "../components/resume/intro";
import Layout from "../components/layout";
import Head from "next/head";
import Link from "next/link";
import ResumeBody from "../components/resume/resume-body";
import ReactGA from "react-ga";
import NavBar from "../components/nav-bar";

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
          <Link href="/resume">
            <a>Resume</a>
          </Link>
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
