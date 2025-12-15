import type { Service, WithContext } from "schema-dts";

export function ServiceSchema() {
  const schema: WithContext<Service> = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Academic Writing and Assignment Help Services",
    provider: {
      "@type": "Organization",
      name: "AssignmentGhar",
      url: "https://assignmentghar.com",
    },
    areaServed: {
      "@type": "Place",
      name: "Worldwide",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Assignment Help Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Essay Writing",
            description:
              "Professional essay writing services for all academic levels",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Research Paper Writing",
            description: "Expert research paper writing and formatting",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Dissertation Help",
            description:
              "Comprehensive dissertation writing and consultation services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Homework Help",
            description: "Quick and reliable homework assistance",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Thesis Writing",
            description: "Professional thesis writing and editing services",
          },
        },
      ],
    },
    description:
      "Comprehensive academic writing services including essays, research papers, dissertations, and homework help. Expert writers, plagiarism-free content, and 24/7 support.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
