import styled from '@emotion/styled'
import Link from 'next/link'
import { ArrowNarrowRight } from '@emotion-icons/heroicons-outline/ArrowNarrowRight'

import { SectionHeading, HeadingText } from '../section-header'
const Container = styled.div`
  display: flex;
  justify-content: space-between;
`
const InfoContainer = styled.div `
  padding: 8rem;
  flex-direction: column;
  width: 20%;
  font-size: 1.25rem;
  color: ${(props) => (props.theme as any).lightText3};
`;
const PostRow = styled.div `
  display: table-row;
  flex-direction: row;
  justify-content: space-between;
  color: ${(props) => (props.theme as any).lightText6};
  font-size: 1.375rem;
  position: relative;
  ::after {
    content: '';
    position: absolute;
    z-index: 1;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid ${(props) => (props.theme as any).lightText6};
  }
`;
const PostsContainer = styled.div`
  display: table;
  flex-direction: column;
  padding: 8rem 8rem 8rem 0;
  max-width: 60%;
`
const BlogCell = styled.div`
  vertical-align: middle;
  position: relative;
  display: table-cell;
  padding: 5rem 0;
`
const PostDate = styled(BlogCell)`
  padding-right: 3rem;
`
const PostTitle = styled(BlogCell)`
  width: 50%;
`
const PostArrow = styled(BlogCell)`
  text-align: right;
`
const Arrow = styled(ArrowNarrowRight)`
  padding-left: 3rem;
  height: 2rem;
`

export default function BlogBlock({ posts }) {
  return (
    <Container>
      <InfoContainer>
        <SectionHeading>Blog</SectionHeading>
        <HeadingText>Latest Posts</HeadingText>
        Maybe someday I&apos;ll get around to updating my blog again. If I do,
        you can check out the latest posts here!
      </InfoContainer>
      <PostsContainer>
        {posts.map((post, i) => {
          return (
            <Link key={i} href={`https://149walnut.com/${post.slug}`}>
              <PostRow>
                <PostDate>{post.date_published}</PostDate>
                <PostTitle>{post.title}</PostTitle>
                <PostArrow>
                  <Arrow />
                </PostArrow>
              </PostRow>
            </Link>
          )
        })}
      </PostsContainer>
    </Container>
  )
}
