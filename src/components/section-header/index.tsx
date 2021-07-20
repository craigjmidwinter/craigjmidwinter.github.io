import styled from '@emotion/styled'

export const SectionHeading = styled.div`
  font-size: 1.325rem;
  color: ${(props) => props.theme.accent};
  font-family: ${(props) => props.theme.titleFont};
  ::before {
    content: '- ';
    color: ${(props) => props.theme.accent};
  }
`
export const HeadingText = styled.div`
  font-size: 2.5rem;
  color: ${(props) => props.theme.lightText4};
  font-family: ${(props) => props.theme.titleFont};
  font-weight: 700;
`
