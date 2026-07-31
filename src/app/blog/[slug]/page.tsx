// app/blog/[slug]/page.tsx

import React from "react";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getAllPosts, Post} from "@/service/blog";
import {excerpt} from "@/components/Jazz/postMeta";
import ClientBlogPost, {NextPostLink} from "./ClientBlogPost";

export function generateStaticParams(): { slug: string }[] {
    const posts: Post[] = getAllPosts();
    return posts.map((post) => ({slug: post.slug}));
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

/** getAllPosts() is already sorted newest first. */
function findPost(slug: string): { post: Post | null; nextPost: NextPostLink | null } {
    const posts = getAllPosts();
    const index = posts.findIndex((p) => p.slug === slug);

    if (index === -1) {
        return {post: null, nextPost: null};
    }

    // the post after this one in newest-first order, wrapping back to the newest
    const next = posts.length > 1 ? posts[(index + 1) % posts.length] : null;

    return {
        post: posts[index],
        nextPost: next ? {title: next.title, slug: next.slug} : null,
    };
}

export async function generateMetadata({params}: BlogPostPageProps): Promise<Metadata> {
    const {slug} = await params;
    const {post} = findPost(slug);

    if (!post) {
        return {title: "Post not found | Craig Midwinter"};
    }

    const title = `${post.title} | Craig Midwinter`;
    const description = excerpt(post, 160);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://midwinter.io/blog/${post.slug}`,
            siteName: "Craig Midwinter",
            type: "article",
        },
        twitter: {
            card: "summary",
            title,
            description,
        },
    };
}

export default async function BlogPostPage({params}: BlogPostPageProps) {
    const {slug} = await params;
    const {post, nextPost} = findPost(slug);

    if (!post) {
        notFound();
    }

    return <ClientBlogPost post={post} nextPost={nextPost}/>;
}
