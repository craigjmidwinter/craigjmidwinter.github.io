// app/nameplate/page.tsx

import React from "react";
import {Metadata} from "next";
import ClientNameplate from "./ClientNameplate";
import {OG_IMAGE, SITE_NAME, canonicalPath} from "../siteMeta";

const DESCRIPTION =
    "Make 3D-printable name plates in your browser: type names, pick a font, " +
    "download a multi-colour 3MF. Names and font files never leave your computer.";

export const metadata: Metadata = {
    title: "Nameplates | Craig Midwinter",
    description: DESCRIPTION,
    alternates: {canonical: canonicalPath("/nameplate")},
    openGraph: {
        title: "Nameplates | Craig Midwinter",
        description: DESCRIPTION,
        url: canonicalPath("/nameplate"),
        siteName: SITE_NAME,
        type: "website",
        locale: "en_CA",
        images: [OG_IMAGE],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nameplates | Craig Midwinter",
        description: DESCRIPTION,
        images: [OG_IMAGE],
    },
};

export default function NameplatePage() {
    return <ClientNameplate/>;
}
