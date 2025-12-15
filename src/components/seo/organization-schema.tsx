import type { Organization, WithContext } from "schema-dts";

export function OrganizationSchema() {
  const schema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AssignmentGhar",
    alternateName: "Assignment Ghar",
    url: "https://assignmentghar.com",
    logo: "https://assignmentghar.com/images/logo.png",
    description:
      "Professional assignment help and academic writing services for students worldwide. Expert writers, fast delivery, plagiarism-free content.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-XXX-XXX-XXXX",
      contactType: "Customer Service",
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://www.facebook.com/assignmentghar",
      "https://twitter.com/assignmentghar",
      "https://www.linkedin.com/company/assignmentghar",
      "https://www.instagram.com/assignmentghar",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
