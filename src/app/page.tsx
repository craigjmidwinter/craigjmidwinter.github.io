// app/page.tsx
import ClientLandingPage from "./ClientLandingPage";

export const metadata = {
    title: "Craig Midwinter - Personal Website",
    description:
        "Welcome to my personal website. Check out my resume, GitHub, LinkedIn, podcast, and blog posts.",
};

export default function Page() {
    return <ClientLandingPage />;
}
