"use client";

import React from "react";
import {NotFoundPage} from "@/components/Jazz/NotFoundPage";

/**
 * Exported to `dist/404/index.html`, which is what GitHub Pages serves for any
 * URL it does not recognise. Next ships a bare built-in 404 when this file is
 * absent — off-brand, and it carried the analytics tag with nothing disclosing it.
 */
export default function NotFound() {
    return (
        <NotFoundPage
            message="That address is not on this site. It may have moved, or it may never have existed."
            backHref="/"
            backLabel="← HOME"
        />
    );
}
