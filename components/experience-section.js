import styled from "@emotion/styled";

import ReactMarkdown from "react-markdown";
const ExperienceContainer = styled.div`
  margin-bottom: 3rem;
`;
const ExperienceSubheading = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  vertical-align: top;
  margin: 1rem 0;
`;
const ExperienceTitle = styled.h2`
  margin: 0;
`;
const ExperienceCompany = styled.h3`
  margin: 0;
`;
const ExperienceTerm = styled.div``;
const ExperienceTech = styled.div`
  font-size: 0.75rem;
  font-style: italic;
`;
const ExperienceBody = styled.div``;

export default function ExperienceSection({
  children,
  company,
  title,
  term,
  tech
}) {
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
  );
}
