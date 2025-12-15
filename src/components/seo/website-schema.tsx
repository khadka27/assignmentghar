import type { WebSite, WithContext } from "schema-dts";

export function WebsiteSchema() {
  const schema: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AssignmentGhar",
    url: "https://assignmentghar.com",
    description:
      "Expert assignment help and academic writing services. Get professional assistance with essays, research papers, dissertations, and more.",
    publisher: {
      "@type": "Organization",
      name: "AssignmentGhar",
      logo: {
        "@type": "ImageObject",
        url: "https://assignmentghar.com/images/logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://assignmentghar.com/search?q={search_term_string}",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
