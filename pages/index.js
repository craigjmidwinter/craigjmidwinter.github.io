import Container from "../components/container";
import { getAllExperiences } from "../lib/api";
import Intro from "../components/resume/intro";
import Layout from "../components/layout";
import Head from "next/head";
import Link from "next/link";
import ResumeBody from "../components/resume/resume-body";
import ReactGA from "react-ga";
import NavBar from "../components/nav-bar";
import LandingHero from "../components/landing/hero";
import CallToAction from "../components/landing/cta";

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
          <LandingHero />
          <CallToAction />
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
