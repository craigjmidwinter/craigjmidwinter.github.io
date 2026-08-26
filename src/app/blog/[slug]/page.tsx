// app/blog/[slug]/page.tsx

import React from "react";
import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getAllPosts, Post} from "@/service/blog";
import {excerpt} from "@/components/Jazz/postMeta";
import ClientBlogPost, {NextPostLink} from "./ClientBlogPost";
import {OG_IMAGE, SITE_NAME, canonicalPath} from "../../siteMeta";

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
    const url = canonicalPath(`/blog/${post.slug}`);

    // A post's own cover art is its social card; posts written before covers
    // existed fall back to the site card. metadataBase makes both absolute.
    const images = post.cover_image
        ? [{url: post.cover_image, alt: post.title}]
        : [OG_IMAGE];

    return {
        title,
        description,
        alternates: {canonical: url},
        openGraph: {
            title,
            description,
            url,
            siteName: SITE_NAME,
            type: "article",
            locale: "en_CA",
            publishedTime: post.date_published,
            modifiedTime: post.date_updated ?? post.date_published,
            images,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images,
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
