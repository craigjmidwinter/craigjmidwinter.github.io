import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const volunteerDir = join(process.cwd(), '_volunteer')

export function getVolunteerFilenames() {
  return fs.readdirSync(volunteerDir)
}
export interface Volunteer {
  company: string
  title: string
  sortDate: Date
  term: string
  content?: string
}
function getValueIfExistsAndIsWanted(
  key: string,
  fields: string[],
  data: { [key: string]: any }
) {
  if (!fields.includes(key)) {
    return
  }
  if (!Object.keys(data).includes(key)) {
    return
  }
  return data[key]
}
export function getVolunteerBySlug(slug, fields: string[] = []): Volunteer {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(volunteerDir, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const item: Volunteer = {
    content: fields.includes('content') && content,
    company: getValueIfExistsAndIsWanted('company', fields, data),
    title: getValueIfExistsAndIsWanted('title', fields, data),
    sortDate: getValueIfExistsAndIsWanted('sortDate', fields, data),
    term: getValueIfExistsAndIsWanted('term', fields, data),
  }

  return item
}

export function getAllVolunteers(fields = []): Volunteer[] {
  const slugs = getVolunteerFilenames()
  const items = slugs
    .map((slug) => getVolunteerBySlug(slug, fields))
    .sort((item1, item2) => {
      return (item1 as any).sortDate > (item2 as any).sortDate ? -1 : 1
    })
  return items
}
