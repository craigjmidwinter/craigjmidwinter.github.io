import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

const experienceDir = join(process.cwd(), '_experience')

export function getExperienceFilenames() {
  return fs.readdirSync(experienceDir)
}

export function getExperienceBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(experienceDir, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }

    if (data[field]) {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllExperiences(fields = []) {
  const slugs = getExperienceFilenames()
  const items = slugs
    .map((slug) => getExperienceBySlug(slug, fields))
    .sort((item1, item2) => {
      console.log(item1)
      return item1.sortDate > item2.sortDate ? -1 : 1
    })
  return items
}
