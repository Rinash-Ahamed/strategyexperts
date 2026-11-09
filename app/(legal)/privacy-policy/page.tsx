import type { Metadata } from "next";
import Link from "@/components/shared/PageLink";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Strategy Experts handles information submitted through Contact and Straty enquiries.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPage() {
  return <>
    <h1>Privacy Policy</h1>
    <p>This notice describes information handled through the {SITE.name} website, including the contact form and Straty, our guided enquiry assistant.</p>
    <h2>Information you provide</h2>
    <p>When you send an enquiry, we receive your name, email address, business name if provided, selected service, message, consent confirmation and whether the enquiry came from Contact or Straty. Please do not include passwords, payment information, sensitive personal data or confidential customer records.</p>
    <h2>Why we use it</h2>
    <p>We use enquiry information to understand your request, reply, discuss relevant services and arrange follow-up about your enquiry. The forms require your consent before submission. Submitting an enquiry does not subscribe you to a newsletter.</p>
    <h2>How messages are delivered</h2>
    <p>Email enquiries pass through our website server and Gmail SMTP to the business email inboxes displayed on this website. Messages and replies may remain in those mailboxes. This website does not maintain a separate enquiry database. Straty is a guided form, not an AI language-model conversation service.</p>
    <p>If you choose WhatsApp, the website prepares a message for you to review and send through WhatsApp. WhatsApp and other external services process information under their own policies.</p>
    <h2>Technical information and providers</h2>
    <p>Our hosting, network and email providers may process request information such as IP addresses, browser information, timestamps and delivery records to operate and protect their services. The enquiry endpoint also uses temporary in-memory counters and a hashed email identifier to limit repeated submissions.</p>
    <p>The website code does not currently include advertising trackers, analytics scripts or application cookies for visitor tracking. Hosting and external linked services may have their own logging and storage practices.</p>
    <h2>Retention and security</h2>
    <p>Enquiry information may be retained in business email and related correspondence for follow-up and service administration. Contact us to discuss retention or request deletion. A specific retention period is not published here; any legal or contractual record-keeping requirements also need to be considered.</p>
    <p>The website uses validation and submission limits, but no internet service can guarantee absolute security. Please share only the information needed to explain your request.</p>
    <h2>Your choices and privacy requests</h2>
    <p>You can choose not to submit a form. To withdraw consent to further enquiry follow-up, request access, correction or deletion, or raise a privacy concern, email <a href={`mailto:${SITE.emails[0]}`}>{SITE.emails[0]}</a>. Explain your request without sending identity documents unless a secure verification method has been agreed. We may need to verify that a request relates to your information.</p>
    <h2>Other websites and updates</h2>
    <p>This notice covers this website, not the separate Product dashboard or third-party websites. It may be updated when our website or enquiry handling changes. For questions, <Link href="/contact">contact Strategy Experts</Link>. See also our <Link href="/terms">Terms of Use</Link>.</p>
  </>;
}
