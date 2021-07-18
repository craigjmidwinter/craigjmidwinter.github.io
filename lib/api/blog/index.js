import fs from 'fs'
import moment from 'moment'
import { join } from 'path'
import matter from 'gray-matter'

const blogDir = join(process.cwd(), '_posts')

export function getBlogPostFilenames() {
  return fs.readdirSync(blogDir)
}

export function getPostBySlug(slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(blogDir, `${realSlug}.md`)
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

export function getAllPosts(fields = []) {
  const slugs = getBlogPostFilenames()
  const items = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((item1, item2) => {
      return Date.parse(item1.date_published) > Date.parse(item2.date_published)
        ? -1
        : 1
    })
    .map((post) => {
      return {
        ...post,
        date_published: moment(Date.parse(post.date_published)).format(
          'MMM Do YYYY'
        ),
        date_updated: moment(Date.parse(post.date_updated)).format(
          'MMM Do YYYY'
        ),
      }
    })
  return items
}
