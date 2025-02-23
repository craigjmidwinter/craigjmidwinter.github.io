// app/blog/[slug]/page.tsx

import React from "react";
import {getAllPosts, getPostBySlug, Post} from "@/service/blog";
import ClientBlogPost from "./ClientBlogPost";

export function generateStaticParams(): { slug: string }[] {
    const posts: Post[] = getAllPosts();
    return posts.map((post) => ({slug: post.slug}));
}

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({params}: BlogPostPageProps) {
    const {slug} = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return <p>Post not found.</p>; // Handle potential null cases
    }
    return <ClientBlogPost post={post}/>;
}