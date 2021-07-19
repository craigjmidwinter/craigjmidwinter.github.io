import Container from './container'

export default function Footer() {
  return (
    <footer>
      {/* @ts-expect-error ts-migrate(2741) FIXME: Property 'children' is missing in type '{}' but re... Remove this comment to see the full error message */}
      <Container></Container>
    </footer>
  )
}
