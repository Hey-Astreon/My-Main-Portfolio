import { createFileRoute } from "@tanstack/react-router";
import { Identity } from "@/sections/Identity";
import { Modules } from "@/sections/Modules";
import { Experience } from "@/sections/Experience";
import { Matrix } from "@/sections/Matrix";
import { Transmission } from "@/sections/Transmission";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Astreon Portfolio — Roushan Kumar" },
      {
        name: "description",
        content:
          "Portfolio of Roushan Kumar — Backend & Cloud Developer building low-latency APIs, distributed career harvesters, and AI developer tools with Next.js 16, FastAPI, and Docker on Oracle Cloud.",
      },
      { property: "og:title", content: "Astreon Portfolio — Roushan Kumar" },
      {
        property: "og:description",
        content:
          "Backend architecture, distributed systems on Oracle Cloud, and AI developer tools — built and measured. See the ASTREON portfolio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Astreon Portfolio — Roushan Kumar" },
      {
        name: "twitter:description",
        content:
          "Backend systems, distributed scrapers on OCI ARM64, and AI developer tooling — the ASTREON portfolio.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Roushan Kumar",
          jobTitle: "Software Developer — Backend & Cloud",
          description:
            "Backend & Cloud Developer and BCA student at Amity University Noida, focused on distributed systems, cloud infrastructure on Oracle Cloud, and AI tooling.",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Patna",
            addressRegion: "Bihar",
            addressCountry: "IN",
          },
          email: "mailto:roushanraut404@gmail.com",
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "Amity University Noida",
          },
          knowsAbout: [
            "Backend Architecture",
            "Distributed Systems",
            "Oracle Cloud (OCI ARM64)",
            "Docker",
            "Redis 7",
            "Turso LibSQL",
            "FastAPI",
            "Next.js 16",
            "TypeScript",
            "Tree-Sitter AST",
            "Web Crypto API",
          ],
          sameAs: [
            "https://github.com/Hey-Astreon",
            "https://linkedin.com/in/astreon4547",
          ],
        }),
      },
    ],
  }),
});

function Index() {
  return (
    <>
      <Identity />
      <Modules />
      <Experience />
      <Matrix />
      <Transmission />
    </>
  );
}
