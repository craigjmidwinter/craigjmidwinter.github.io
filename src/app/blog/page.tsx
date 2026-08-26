// app/blog/page.tsx

import React from "react";
import {Metadata} from "next";
import ClientBlogListing from "./ClientBlogListing";
import {getAllPosts, Post} from "@/service/blog";
import {BLOG_DESCRIPTION, OG_IMAGE, SITE_NAME, canonicalPath} from "../siteMeta";

const DESCRIPTION = BLOG_DESCRIPTION;

export const metadata: Metadata = {
    title: "Blog | Craig Midwinter",
    description: DESCRIPTION,
    alternates: {canonical: canonicalPath("/blog")},
    openGraph: {
        title: "Blog | Craig Midwinter",
        description: DESCRIPTION,
        url: canonicalPath("/blog"),
        siteName: SITE_NAME,
        type: "website",
        locale: "en_CA",
        images: [OG_IMAGE],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | Craig Midwinter",
        description: DESCRIPTION,
        images: [OG_IMAGE],
    },
};

export default function BlogListingPage() {
    const posts: Post[] = getAllPosts();
    return <ClientBlogListing posts={posts}/>;
}
