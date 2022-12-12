import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const projectDir = join(process.cwd(), '_project')

export function getProjectFilenames() {
  return fs.readdirSync(projectDir)
}
export interface Project {
  company: string
  title: string
  sortDate: Date
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
export function getProjectBySlug(slug, fields: string[] = []): Project {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(projectDir, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const item: Project = {
    content: fields.includes('content') && content,
    company: getValueIfExistsAndIsWanted('company', fields, data),
    title: getValueIfExistsAndIsWanted('title', fields, data),
    sortDate: getValueIfExistsAndIsWanted('sortDate', fields, data),
    tech: getValueIfExistsAndIsWanted('tech', fields, data),
  }

  return item
}

export function getAllProjects(fields = []): Project[] {
  const slugs = getProjectFilenames()
  const items = slugs
    .map((slug) => getProjectBySlug(slug, fields))
    .sort((item1, item2) => {
      return (item1 as any).sortDate > (item2 as any).sortDate ? -1 : 1
    })
  return items
}
