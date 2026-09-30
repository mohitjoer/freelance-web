import type { Metadata } from "next";
import Link from "next/link";
import { Page, PageHeader, SidePanel } from "@/components/PageShell";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Help & Support",
  description: "Answers to common questions about posting jobs, proposals, chat and reporting on FreeLanceBase.",
};

const faqs = [
  {
    q: "How do I apply for a job?",
    a: 'Open any job from the open jobs page and send a proposal. You can submit one proposal per job and edit or withdraw it at any time.',
  },
  {
    q: "How do I hire a freelancer?",
    a: "Post a job with your requirements and budget, then review incoming proposals from that job's page and accept the one that fits.",
  },
  {
    q: "Where do I chat about a project?",
    a: "Every active project has its own chat room, linked from the job and from the project card in your dashboard.",
  },
  {
    q: "How do I report someone?",
    a: "Use the report action on the project card in your dashboard. Our team reviews every report.",
  },
];

export default function SupportPage() {
  return (
    <Page
      aside={<SidePanel active="/support" />} width="max-w-2xl"
      back={{ href: "/dashboard", label: "dashboard" }}
    >
      <PageHeader title="Help & support" body="The questions we get most, answered." />

      <Panel className="divide-y divide-hairline">
        {faqs.map((faq) => (
          <details key={faq.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
              {faq.q}
              <span
                aria-hidden
                className="shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
              >
                &rsaquo;
              </span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
          </details>
        ))}
      </Panel>

      <div className="mt-8 border-t border-hairline pt-6 text-sm text-muted-foreground">
        Still stuck? Email{" "}
        <a
          href="mailto:support@freelancebase.com"
          className="text-ink underline underline-offset-4"
        >
          support@freelancebase.com
        </a>{" "}
        or read the{" "}
        <Link href="/terms" className="text-ink underline underline-offset-4">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-ink underline underline-offset-4">
          privacy policy
        </Link>
        .
      </div>
    </Page>
  );
}
