"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard as DashboardOutlinedIcon, PlusCircle as PostAddOutlinedIcon, User as PersonOutlineOutlinedIcon, Bell as NotificationsOutlinedIcon, Settings as SettingsOutlinedIcon, CircleHelp as HelpOutlineOutlinedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardShell, { type NavItem } from "@/components/dashboard/Shell";
import { Panel, PanelHeader, StatRow, Tabs } from "@/components/dashboard/ui";
import { hostOf } from "@/lib/format";
import ClientJobList from "@/components/client comp/joblist";
import JobOngoing from "@/components/client comp/jobongoing";
import JobFinshed from "@/components/client comp/jobfinshed";

interface ClientData {
  userId: string;
  name: string;
  role: string;
  image: string | null;
  bio?: string;
  companyName?: string;
  companyWebsite?: string;
  status?: string;
}

interface Job {
  _id: string;
  jobId: string;
  title: string;
  status: string;
}

interface ClientDashboardProps {
  client: ClientData;
  jobs: Job[];
}

const TABS = [
  { id: "posted", label: "Posted" },
  { id: "ongoing", label: "Ongoing" },
  { id: "finished", label: "Finished" },
] as const;

export default function ClientDashboard({ client, jobs }: ClientDashboardProps) {
  const [activeView, setActiveView] = useState<(typeof TABS)[number]["id"]>("posted");

  const counts = {
    open: jobs.filter((j) => j.status === "open").length,
    ongoing: jobs.filter((j) => j.status === "in-progress" || j.status === "ongoing").length,
    finished: jobs.filter((j) => j.status === "completed" || j.status === "finished").length,
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlinedIcon /> },
    { label: "Post job", href: "/jobs/create", icon: <PostAddOutlinedIcon /> },
    { label: "Profile", href: `/profile/${client.userId}`, icon: <PersonOutlineOutlinedIcon /> },
    { label: "Notifications", href: "/notifications", icon: <NotificationsOutlinedIcon /> },
    { label: "Settings", href: "/setting", icon: <SettingsOutlinedIcon /> },
    { label: "Help & support", href: "/support", icon: <HelpOutlineOutlinedIcon /> },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      user={{
        name: client.name,
        subtitle: client.companyName || "Client",
        image: client.image,
      }}
      title="Dashboard"
      action={
        <Button asChild size="sm">
          <Link href="/jobs/create">Post job</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <Panel>
          <StatRow
            stats={[
              { label: "Open", value: counts.open },
              { label: "Ongoing", value: counts.ongoing },
              { label: "Finished", value: counts.finished },
              { label: "Total posted", value: jobs.length },
            ]}
          />
        </Panel>

        {client.bio && (
          <Panel>
            <PanelHeader title="About" />
            <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground measure">
              {client.bio}
            </p>
          </Panel>
        )}

        {(client.companyName || client.companyWebsite) && (
          <Panel>
            <PanelHeader
              title="Company"
              action={
                <Link
                  href="/profile/edit"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Edit
                </Link>
              }
            />
            <dl className="divide-y divide-hairline">
              <div className="flex items-center justify-between gap-6 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">Name</dt>
                <dd className="text-sm font-medium text-foreground">
                  {client.companyName || "Not set"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-6 px-5 py-3.5">
                <dt className="text-sm text-muted-foreground">Website</dt>
                <dd className="text-sm font-medium">
                  {client.companyWebsite ? (
                    <a
                      href={client.companyWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground underline underline-offset-4"
                    >
                      {hostOf(client.companyWebsite)}
                    </a>
                  ) : (
                    <span className="text-foreground">Not set</span>
                  )}
                </dd>
              </div>
            </dl>
          </Panel>
        )}

        <Panel>
          <Tabs tabs={TABS} value={activeView} onChange={setActiveView} />
          <div className="px-5 py-5">
            {activeView === "posted" && <ClientJobList />}
            {activeView === "ongoing" && <JobOngoing />}
            {activeView === "finished" && <JobFinshed />}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
