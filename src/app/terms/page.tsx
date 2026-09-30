import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageHeader, SidePanel } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read the Terms and Conditions of FreelanceBase outlining guidelines, user accounts, and platform services.",
};

// Fixed, not `new Date()` — a legal page that claims it was updated whenever
// you happened to open it is a page nobody should trust.
const LAST_UPDATED = "May 18, 2026";

const SECTIONS: [string, string | React.ReactNode][] = [
  ["Acceptance of Terms", "By accessing or using the FreeLanceBase Platform (\"Platform\"), you agree to comply with and be bound by these Terms and Conditions (\"Terms\"). If you do not agree, do not use the Platform."],
  [
    "User Accounts",
    <>
      Users must register via the Platform&apos;s built-in authentication. You are responsible for your
      account and must not engage in fraud or unauthorized promotion. By registering, you accept our{" "}
      <Link href="/privacy">Privacy Policy</Link>.
    </>,
  ],
  ["Eligibility", "You must be 18 years of age or have legal capacity in your jurisdiction to use this platform."],
  ["Platform Services", "The platform allows clients to post jobs and freelancers to submit proposals and collaborate on projects."],
  ["User Conduct", "You agree not to break laws, impersonate others, spread malware, or advertise without permission."],
  ["Payments and Fees", "All payments are made directly between freelancers and clients. FreeLanceBase does not hold funds or offer payment guarantees."],
  ["Intellectual Property", "All original platform content is owned by FreeLanceBase and cannot be copied or reused without written permission."],
  ["Termination", "We may suspend or terminate accounts that violate our policies without prior notice."],
  ["Limitation of Liability", "We are not liable for indirect or consequential damages. Use the platform at your own risk."],
  ["Dispute Resolution", "Users are encouraged to resolve issues directly. Mediation by us is optional and not guaranteed."],
  ["Third-Party Disclaimer", "Authentication is managed by the Platform's own authentication system. We are not liable for issues related to authentication services."],
  ["Privacy Policy", "Please refer to our Privacy Policy for detailed information on how we handle your personal data."],
  ["Modifications", "Terms may be updated at any time. Continued use of the platform constitutes acceptance of any changes."],
  ["Governing Law", "These Terms are governed by the laws of India and any disputes will be resolved in Indian courts."],
  [
    "Contact Information",
    <>
      For questions about these Terms, contact us at{" "}
      <a href="mailto:support@freelancebase.com">support@freelancebase.com</a>.
    </>,
  ],
];

export default function TermsPage() {
  return (
    <Page
      aside={<SidePanel active="/terms" />}
      back={{ href: "/", label: "home" }}
    >
      <PageHeader
        title="Terms and Conditions"
        body={`Read these before using FreeLanceBase. Last updated ${LAST_UPDATED}.`}
      />

      <ol className="legal">
        {SECTIONS.map(([title, body], i) => (
          <li key={title}>
            <h2>
              {i + 1}. {title}
            </h2>
            <p>{body}</p>
          </li>
        ))}
      </ol>
    </Page>
  );
}
