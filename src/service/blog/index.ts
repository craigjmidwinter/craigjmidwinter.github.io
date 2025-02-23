import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Define the expected structure of the front matter.
export interface PostFrontMatter {
    title: string;
    slug?: string;
    date_published: string;
    date_updated?: string;
    tags?: string;
    cover_image?: string; // Ensure cover images are properly handled
}

// Define the structure of a Post.
export interface Post extends PostFrontMatter {
    slug: string;
    content: string;
}

const postsDirectory = path.join(process.cwd(), "_posts");

export function getAllPosts(): Post[] {
    const fileNames: string[] = fs.readdirSync(postsDirectory);
    const posts: Post[] = fileNames.map((fileName) => {
        const fileSlug: string = fileName.replace(/\.md$/, "");
        const fullPath: string = path.join(postsDirectory, fileName);
        const fileContents: string = fs.readFileSync(fullPath, "utf8");
        const {data, content} = matter(fileContents);
        const frontMatter = data as PostFrontMatter;
        const slug: string = frontMatter.slug ? frontMatter.slug : fileSlug;

        // Ensure cover_image is always a valid string (fallback to empty string)
        const cover_image = frontMatter.cover_image ? frontMatter.cover_image.trim() : "";

        return {slug, ...frontMatter, cover_image, content};
    });

    return posts.sort(
        (a, b) =>
            new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
    );
}

export function getPostBySlug(slug: string): Post {
    const posts: Post[] = getAllPosts();
    const post = posts.find((post) => post.slug === slug);
    if (!post) {
        throw new Error(`Post with slug '${slug}' not found`);
    }
    return post;
}

export function getPostsByTag(tag: string): Post[] {
    const allPosts: Post[] = getAllPosts();
    return allPosts.filter((post) => {
        const tags: string[] = post.tags
            ? post.tags.split(",").map((t: string) => t.trim().toLowerCase())
            : [];
        return tags.includes(tag.toLowerCase());
    });
}
