"use client";

import React from "react";
import {NotFoundPage} from "@/components/Jazz/NotFoundPage";

export default function NotFound() {
    return (
        <NotFoundPage
            message="This post either moved, never existed, or got lost in one of the many migrations this blog has survived."
            backHref="/blog"
            backLabel="← ALL POSTS"
        />
    );
}
