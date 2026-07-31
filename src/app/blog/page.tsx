// app/blog/page.tsx

import React from "react";
import {Metadata} from "next";
import ClientBlogListing from "./ClientBlogListing";
import {getAllPosts, Post} from "@/service/blog";

const DESCRIPTION =
    "Sixteen posts from the years I wired up my house and then wrote about it. " +
    "Home Assistant, Hue, a Raspberry Pi that plays records, and one voice actor " +
    "who reads my cat's litter box.";

export const metadata: Metadata = {
    title: "Blog | Craig Midwinter",
    description: DESCRIPTION,
    openGraph: {
        title: "Blog | Craig Midwinter",
        description: DESCRIPTION,
        url: "https://midwinter.io/blog",
        siteName: "Craig Midwinter",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Blog | Craig Midwinter",
        description: DESCRIPTION,
    },
};

export default function BlogListingPage() {
    const posts: Post[] = getAllPosts();
    return <ClientBlogListing posts={posts}/>;
}
