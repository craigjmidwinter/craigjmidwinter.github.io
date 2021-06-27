import styled from "@emotion/styled";
import ResumeSection from "./resume-section";
import ExperienceSection from "./experience-section";
import ReactMarkdown from "react-markdown";

const ResumeContainer = styled.div`
`;
const ParagraphContainer = styled.div`
  padding: 0 8.6rem 8.6rem 8.6rem;
`;

export default function ResumeBody({ experiences }) {
  return (
    <ResumeContainer>
      <ResumeSection shaded underlineHeading title="Summary">
        <ParagraphContainer>
          Currently primarily using ReactJS on the front-end and working with
          NodeJS, C#, and Go in containerized environments deployed to managed
          Kubernetes clusters on the back-end, using Terraform to manage cloud
          infrastructure on AWS and Digital Ocean.
        </ParagraphContainer>
      </ResumeSection>
      <ResumeSection bulletHeading title="Employment History">
        {experiences.map(experience => {
          return (
            <ExperienceSection
              company={experience.company}
              term={`${experience.start} - ${experience.end}`}
              title={experience.title}
              tech={experience.tech}
            >
              {experience.content}
            </ExperienceSection>
          );
        })}
      </ResumeSection>
      <ResumeSection
        shaded
        bulletHeading
        rightAlignHeader
        title="Select Personal Projects"
      >
        <ExperienceSection
          company={"Goalfeed"}
          title={"Sole Developer"}
          tech={"golang, python, kubernetes, redis, postgres"}
        >
          Goalfeed is a service that I developed and maintain as a hobby. It
          provides realtime updates for NHL and MLB scores to various external
          consumers. Users primarily consume the feed using a Home Assistant
          integration that I also maintain in order to trigger light shows in
          their home when their favourite team scores.
        </ExperienceSection>
        <ExperienceSection
          company={"Open Source"}
          title={"Contributor/Maintainer"}
          tech={"JS, golang, python, kubernetes, redis, postgres"}
        >
          I contribute or maintain a variety of open-source projects and
          libraries. Including but not limited to integrations for Home
          Assistant and the Honeywell Totalconnect python client.
        </ExperienceSection>
      </ResumeSection>
      <ResumeSection
        bulletHeading
        rightAlignHeader
        title="Volunteer Experience"
      >
        <ExperienceSection
          company={"Thistle Curling Club Board of Executives"}
          term={"2015 - Current"}
          title={"Executive Board Member"}
        >
          I have served on the board of executives for the Thistle Curling Club
          since 2015. In addition to providing input to help shape the future of
          the club, I am also responsible for club communications.
        </ExperienceSection>
        <ExperienceSection
          company={"The Week Thus Far"}
          term={"2011 - 2014"}
          title={"Writer, Producer"}
        >
          Created and served as a writer and producer for The Week Thus Far, a
          comedic late-night talk show which aired throughout Manitoba over a
          three-year period. Lead a twelve-person creative team, produced
          content under strict deadlines, and trained a volunteer crew in
          various technical roles.
        </ExperienceSection>
      </ResumeSection>
      <ResumeSection shaded underlineHeading title="Fun Facts">
        <ParagraphContainer>
          <ReactMarkdown>
            {`
- I am currently running a three-node bare-metal k8s cluster as a homelab
- I maintain a blog about Home Automation on [149walnut.com](http://149walnut.com)
- I am a huge fan of The Real Housewives reality TV franchise
`}
          </ReactMarkdown>
        </ParagraphContainer>
      </ResumeSection>
    </ResumeContainer>
  );
}
