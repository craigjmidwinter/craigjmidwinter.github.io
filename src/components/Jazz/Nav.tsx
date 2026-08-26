import React from "react";
import styled, {css} from "styled-components";

/* The #00a7a0 fill teal only reaches 2.86:1 on the paper bar; this is the same hue
   darkened until it clears the 4.5:1 AA floor (5.32:1). See README, "Colour pairings". */
const TEAL_ON_PAPER = "#007570";

const Bar = styled.nav`
    position: sticky;
    top: 0;
    z-index: 40;
    background: #fbfaf7;
    border-bottom: 2px solid #111;
`;

const Inner = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 14px clamp(20px, 4vw, 56px);
    font: 500 10.5px/1 'JetBrains Mono', monospace;
    letter-spacing: 0.14em;
`;

const Wordmark = styled.a`
    color: #111;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
        color: ${TEAL_ON_PAPER};
    }
`;

const Links = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: clamp(12px, 2vw, 26px);
`;

const NavLink = styled.a<{ $active?: boolean }>`
    color: #111;
    text-decoration: none;

    &:hover {
        color: ${TEAL_ON_PAPER};
    }

    ${({$active}) =>
        $active &&
        css`
            color: ${TEAL_ON_PAPER};
            border-bottom: 2px solid ${TEAL_ON_PAPER};
            padding-bottom: 2px;
        `}
`;

interface NavItem {
    href: string;
    label: string;
    active?: boolean;
}

const SECTIONS: NavItem[] = [
    {href: "#work", label: "WORK"},
    {href: "#about", label: "ABOUT"},
    {href: "#pod", label: "POD"},
    {href: "#archive", label: "NOTES"},
    {href: "#contact", label: "CONTACT"},
];

/** Blog variant: the same bar, but every anchor points back at the landing page
 *  and BLOG is the current page. */
const BLOG_SECTIONS: NavItem[] = [
    {href: "/#work", label: "WORK"},
    {href: "/#about", label: "ABOUT"},
    {href: "/#pod", label: "POD"},
    {href: "/blog", label: "BLOG", active: true},
    {href: "/#contact", label: "CONTACT"},
];

export function Nav({page = "home"}: { page?: "home" | "blog" }) {
    const isBlog = page === "blog";
    const sections = isBlog ? BLOG_SECTIONS : SECTIONS;

    return (
        <Bar aria-label="Primary">
            <Inner>
                <Wordmark
                    href={isBlog ? "/" : "#top"}
                    aria-label={
                        isBlog
                            ? "Craig Midwinter, back to the home page"
                            : "Craig Midwinter, back to top"
                    }
                >
                    C.J.M — 001
                </Wordmark>
                <Links>
                    {sections.map((s) => (
                        <NavLink
                            key={s.href}
                            href={s.href}
                            $active={s.active}
                            aria-current={s.active ? "page" : undefined}
                        >
                            {s.label}
                        </NavLink>
                    ))}
                </Links>
            </Inner>
        </Bar>
    );
}
