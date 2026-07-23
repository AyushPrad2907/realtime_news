"use client";

import { useStore } from "@/lib/store";

interface StaticPageProps {
  type: "privacy" | "terms";
}

const PRIVACY_CONTENT = {
  title: "Privacy Policy",
  updated: "Last updated: July 1, 2025",
  intro:
    "This privacy policy explains how The National Dispatch collects, uses, and protects information about you when you use our website, mobile applications, and related services. We are committed to being transparent about our data practices and to giving you meaningful control over your information.",
  sections: [
    {
      h: "Information we collect",
      body: [
        "We collect information in three ways: information you provide directly to us (such as your email address when you subscribe to our newsletter), information collected automatically (such as your IP address, browser type, and pages visited), and information from third parties (such as analytics providers and advertising partners).",
        "When you create an account, subscribe to our newsletter, or submit a form, we collect the information you provide, which may include your name, email address, and any other details you choose to share. When you browse our site, we automatically collect technical information about your device and your usage patterns, which helps us understand how our content is being read and improve our service.",
      ],
    },
    {
      h: "How we use your information",
      body: [
        "We use the information we collect to deliver and improve our journalism, to communicate with you about our reporting and our products, to operate and maintain our technical infrastructure, to comply with our legal obligations, and to detect and prevent fraud or abuse of our service.",
        "We do not sell your personal information to third parties. We may share aggregated, non-identifying information with our advertising and analytics partners for the purpose of measuring and improving the performance of our content and advertising.",
      ],
    },
    {
      h: "Cookies and tracking",
      body: [
        "We use cookies and similar technologies to remember your preferences, to measure how our content is consumed, and to serve relevant advertising. We categorise our cookies into essential cookies (which are required for the site to function), analytics cookies (which help us understand usage), and advertising cookies (which support our business model).",
        "You can control cookies through your browser settings and through our cookie preference tool, available at the bottom of every page. Disabling non-essential cookies will not affect your ability to read our content.",
      ],
    },
    {
      h: "Your rights",
      body: [
        "Depending on your jurisdiction, you may have the right to access the personal information we hold about you, to request its correction or deletion, to object to or restrict certain processing, and to receive a copy of your data in a portable format.",
        "To exercise any of these rights, please contact us at privacy@nationaldispatch.example. We will respond to your request within 30 days, in accordance with applicable law.",
      ],
    },
    {
      h: "Data retention",
      body: [
        "We retain your personal information only for as long as is necessary for the purposes for which it was collected, or as required by law. When your information is no longer needed, we will delete it or anonymise it so that it can no longer be associated with you.",
      ],
    },
    {
      h: "Contact",
      body: [
        "If you have any questions about this privacy policy or our data practices, please contact us at privacy@nationaldispatch.example. Our data protection officer can be reached at the same address.",
      ],
    },
  ],
};

const TERMS_CONTENT = {
  title: "Terms of Service",
  updated: "Last updated: July 1, 2025",
  intro:
    "These terms of service govern your use of The National Dispatch website, mobile applications, and related services. By using our service, you agree to these terms. If you do not agree, you may not use our service.",
  sections: [
    {
      h: "Use of our service",
      body: [
        "You may use our service for personal, non-commercial reading and research. You may not republish, redistribute, or reproduce our content without our prior written permission, except for brief quotations in line with fair use.",
        "You agree not to use our service for any unlawful purpose, to interfere with the security of the service, to attempt to access areas of the service not intended for public access, or to use automated tools to scrape or copy our content without authorisation.",
      ],
    },
    {
      h: "User contributions",
      body: [
        "If you submit comments, tips, or other content to us, you grant us a non-exclusive, royalty-free, worldwide licence to use, reproduce, and distribute that content in connection with our service. You retain ownership of your contributions.",
        "You are solely responsible for the content you submit, and you represent that you have the right to submit it without infringing the rights of any third party.",
      ],
    },
    {
      h: "Intellectual property",
      body: [
        "All content published on The National Dispatch — including articles, images, podcasts, and graphics — is the property of The National Dispatch or its licensors, and is protected by copyright and other intellectual property laws. You may not use our content for commercial purposes without our written permission.",
        "Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.",
      ],
    },
    {
      h: "Disclaimer of warranties",
      body: [
        "Our service is provided on an as-is and as-available basis. We make no warranties, express or implied, about the completeness, accuracy, or reliability of our content, or about the availability of our service. Any action you take based on our content is strictly at your own risk.",
      ],
    },
    {
      h: "Limitation of liability",
      body: [
        "To the fullest extent permitted by law, The National Dispatch shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of, or inability to use, our service — even if we have been advised of the possibility of such damages.",
      ],
    },
    {
      h: "Changes to these terms",
      body: [
        "We may update these terms from time to time. When we do, we will revise the updated date at the top of this page. We encourage you to review these terms periodically. Your continued use of the service after any changes constitutes acceptance of the updated terms.",
      ],
    },
    {
      h: "Contact",
      body: [
        "If you have any questions about these terms, please contact us at legal@nationaldispatch.example.",
      ],
    },
  ],
};

export function StaticPage({ type }: StaticPageProps) {
  const { navigate } = useStore();
  const content = type === "privacy" ? PRIVACY_CONTENT : TERMS_CONTENT;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 pt-6 md:pt-10 pb-12">
      <p className="font-ui text-[11px] font-bold uppercase tracking-[0.2em] text-brand mb-3">
        Legal
      </p>
      <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
        {content.title}
      </h1>
      <p className="font-ui text-sm text-ink-tertiary mb-8">{content.updated}</p>

      <p className="font-serif text-lg leading-relaxed text-ink-secondary mb-10 border-l-4 border-brand pl-5">
        {content.intro}
      </p>

      <div className="space-y-10">
        {content.sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-display text-2xl font-bold mb-3">
              {String(i + 1)}. {s.h}
            </h2>
            <div className="space-y-4">
              {s.body.map((p, j) => (
                <p key={j} className="font-serif text-base leading-relaxed text-ink">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-border text-center">
        <p className="font-ui text-sm text-ink-secondary mb-3">
          Questions about this document?
        </p>
        <button
          onClick={() => navigate({ type: "contact" })}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-md border border-border hover:bg-muted font-ui text-sm font-semibold"
        >
          Contact us
        </button>
      </div>
    </div>
  );
}
