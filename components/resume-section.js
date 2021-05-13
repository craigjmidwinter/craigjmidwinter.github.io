import styled from "@emotion/styled";

const Section = styled.div`
margin-bottom: 3rem;
`;
const SectionHeader = styled.h1`
border-top: solid black 1px;
  border-bottom: solid black 1px;
  padding: 0.5rem;
`;
const SectionBody = styled.div``;

export default function ResumeSection({ children, title, ...props }) {
  return (
    <Section>
      <SectionHeader>{title}</SectionHeader>
      <SectionBody>{children}</SectionBody>
    </Section>
  );
}
