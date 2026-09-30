import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Page, PageHeader, SidePanel } from "@/components/PageShell"
import { Panel } from "@/components/ui/panel"

const LINKS = [
  { href: "/profile/edit", title: "Edit your profile", body: "Name, bio, skills, portfolio and company details." },
  { href: "/notifications", title: "Notifications", body: "Everything that happened on your jobs and proposals." },
  { href: "/support", title: "Help & support", body: "Answers to the questions we get most." },
]

export default function SettingsPage() {
  return (
    <Page
      aside={<SidePanel active="/setting" />} width="max-w-2xl"
      back={{ href: "/dashboard", label: "dashboard" }}
    >
      <PageHeader title="Settings" />

      <Panel>
        <ul className="divide-y divide-hairline">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-soft"
              >
                <span>
                  <span className="block text-sm font-medium text-ink">{l.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{l.body}</span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-ink" />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </Page>
  )
}
