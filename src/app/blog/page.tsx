// app/blog/page.tsx

import React from "react";
import ClientBlogListing from "./ClientBlogListing";
import {getAllPosts, Post} from "@/service/blog";

export default function BlogListingPage() {
    const posts: Post[] = getAllPosts();
    return <ClientBlogListing posts={posts}/>;
}