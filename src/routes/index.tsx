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
      { title: "Astreon Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Roushan Kumar — Full Stack Software Developer building low-latency APIs, AI orchestration platforms, and secure zero-knowledge tools with C#/.NET, FastAPI, and React.",
      },
      { property: "og:title", content: "Astreon Portfolio" },
      {
        property: "og:description",
        content:
          "Backend architecture, AI-powered platforms, and full-stack products — built and measured. See the ASTREON portfolio.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: "Astreon Portfolio" },
      {
        name: "twitter:description",
        content:
          "Backend systems, AI orchestration, and full-stack engineering — the ASTREON portfolio.",
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
          jobTitle: "Full Stack Software Developer",
          description:
            "Full Stack Software Developer and BCA student at Amity University Noida, focused on backend architecture and AI-powered systems.",
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
            "C#",
            ".NET",
            "Spring Boot",
            "FastAPI",
            "PostgreSQL",
            "React",
            "TypeScript",
            "AI Systems",
          ],
          sameAs: [
            "https://github.com/Hey-Astreon",
            "https://www.linkedin.com/in/roushan-kumar-ab4b19250/",
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
