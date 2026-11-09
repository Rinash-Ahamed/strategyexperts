import type { Metadata } from "next";
import Link from "@/components/shared/PageLink";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Strategy Experts website and making business enquiries.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <>
    <h1>Terms of Use</h1>
    <p>These terms explain use of the {SITE.name} website. For information about enquiry data, read our <Link href="/privacy-policy">Privacy Policy</Link>.</p>
    <h2>Website information</h2>
    <p>This website introduces our consultancy and business support services. Its content is general information, not a personalised recommendation or a guarantee of revenue, rankings, profitability or other business outcomes. Results depend on your business, market conditions and the agreed scope of work.</p>
    <h2>Enquiries and service engagements</h2>
    <p>Submitting a form, speaking with Straty or selecting a pricing plan is an enquiry, not a completed purchase or service agreement. Scope, fees, taxes, payment schedules, cancellation, refunds, deliverables and responsibilities should be confirmed in a separate written agreement before work begins. That agreement governs the engagement.</p>
    <h2>Responsible use</h2>
    <p>Provide accurate contact details and only share information you are authorised to provide. Do not submit passwords, payment details, confidential customer records or sensitive personal information. Do not misuse the forms, send spam, attempt unauthorised access or interfere with the website.</p>
    <h2>Content and brand assets</h2>
    <p>Website content and artwork belong to their respective owners. Third-party logos and platform names identify the relevant businesses and services; their display does not by itself establish endorsement, certification or a formal partnership. Do not reuse protected material without the appropriate permission.</p>
    <h2>External services and availability</h2>
    <p>Product, social media and WhatsApp links take you to separate services with their own terms and privacy practices. We aim to keep information accurate and the website available, but interruptions, errors and changes can occur. Confirm important details with us before relying on them.</p>
    <h2>Updates and questions</h2>
    <p>These website terms may be updated as the website changes. Updates do not replace an existing signed service agreement. Nothing here excludes rights that cannot lawfully be excluded.</p>
    <p>For questions, email <a href={`mailto:${SITE.emails[0]}`}>{SITE.emails[0]}</a> or <Link href="/contact">contact our team</Link>.</p>
  </>;
}
