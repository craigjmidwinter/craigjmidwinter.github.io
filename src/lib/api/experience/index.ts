import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const experienceDir = join(process.cwd(), '_experience')

export function getExperienceFilenames() {
  return fs.readdirSync(experienceDir)
}
export interface Experience {
  company: string
  title: string
  sortDate: Date
  start: string
  end: string
  tech: string
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
export function getExperienceBySlug(slug, fields: string[] = []): Experience {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(experienceDir, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const item: Experience = {
    content: fields.includes('content') && content,
    company: getValueIfExistsAndIsWanted('company', fields, data),
    title: getValueIfExistsAndIsWanted('title', fields, data),
    start: getValueIfExistsAndIsWanted('start', fields, data),
    sortDate: getValueIfExistsAndIsWanted('sortDate', fields, data),
    end: getValueIfExistsAndIsWanted('end', fields, data),
    tech: getValueIfExistsAndIsWanted('tech', fields, data),
  }

  return item
}

export function getAllExperiences(fields = []): Experience[] {
  const slugs = getExperienceFilenames()
  const items = slugs
    .map((slug) => getExperienceBySlug(slug, fields))
    .sort((item1, item2) => {
      return (item1 as any).sortDate > (item2 as any).sortDate ? -1 : 1
    })
  return items
}
