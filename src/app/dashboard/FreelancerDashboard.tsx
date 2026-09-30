"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard as DashboardOutlinedIcon, Briefcase as WorkOutlineOutlinedIcon, User as PersonOutlineOutlinedIcon, Bell as NotificationsOutlinedIcon, Settings as SettingsOutlinedIcon, CircleHelp as HelpOutlineOutlinedIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DashboardShell, { type NavItem } from "@/components/dashboard/Shell";
import { Panel, PanelHeader, StatRow, Tabs } from "@/components/dashboard/ui";
import Proposallist from "@/components/freelancer comp/proposallist";
import WorkingJob from "@/components/freelancer comp/workingjob";
import CompletedJob from "@/components/freelancer comp/completedjob";
import type { FreelancerData, Proposal } from "./types";

interface FreelancerDashboardProps {
  freelancer: FreelancerData;
  proposals: Proposal[];
}

const TABS = [
  { id: "proposals", label: "Proposals" },
  { id: "jobs", label: "Active" },
  { id: "completed", label: "Completed" },
] as const;

export default function FreelancerDashboard({ freelancer, proposals }: FreelancerDashboardProps) {
  const [activeView, setActiveView] = useState<(typeof TABS)[number]["id"]>("proposals");

  const proposalCounts = {
    pending: proposals.filter((p) => p.status === "pending").length,
    accepted: proposals.filter((p) => p.status === "accepted").length,
    completed: proposals.filter((p) => p.status === "completed").length,
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardOutlinedIcon /> },
    { label: "Find jobs", href: "/jobs/open", icon: <WorkOutlineOutlinedIcon /> },
    { label: "Profile", href: `/profile/${freelancer.userId}`, icon: <PersonOutlineOutlinedIcon /> },
    { label: "Notifications", href: "/notifications", icon: <NotificationsOutlinedIcon /> },
    { label: "Settings", href: "/setting", icon: <SettingsOutlinedIcon /> },
    { label: "Help & support", href: "/support", icon: <HelpOutlineOutlinedIcon /> },
  ];

  return (
    <DashboardShell
      navItems={navItems}
      user={{
        name: freelancer.name,
        subtitle: freelancer.experienceLevel
          ? `${freelancer.experienceLevel[0].toUpperCase()}${freelancer.experienceLevel.slice(1)} freelancer`
          : "Freelancer",
        image: freelancer.image,
      }}
      title="Dashboard"
      action={
        <Button asChild size="sm">
          <Link href="/jobs/open">Find work</Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <Panel>
          <StatRow
            stats={[
              { label: "Pending", value: proposalCounts.pending },
              { label: "Active", value: proposalCounts.accepted },
              { label: "Completed", value: proposalCounts.completed },
              { label: "Projects done", value: freelancer.projects_done ?? 0 },
            ]}
          />
        </Panel>

        {freelancer.bio && (
          <Panel>
            <PanelHeader title="About" />
            <p className="px-5 py-4 text-sm leading-relaxed text-muted-foreground measure">
              {freelancer.bio}
            </p>
          </Panel>
        )}

        <Panel>
          <PanelHeader
            title="Skills"
            action={
              <Link
                href="/profile/edit"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Edit
              </Link>
            }
          />
          {freelancer.skills.length > 0 ? (
            <ul className="flex flex-wrap gap-2 px-5 py-4">
              {freelancer.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-md bg-surface-soft px-2.5 py-1 text-xs font-medium text-muted-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-4 text-sm text-muted-foreground">
              No skills added yet.{" "}
              <Link href="/profile/edit" className="text-foreground underline underline-offset-4">
                Add your skills
              </Link>
              .
            </p>
          )}
        </Panel>

        {freelancer.portfolio.length > 0 && (
          <Panel>
            <PanelHeader
              title="Portfolio"
              action={
                <Link
                  href="/profile/edit"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Edit
                </Link>
              }
            />
            <ul className="divide-y divide-hairline">
              {freelancer.portfolio.map((item) => (
                <li key={`${item.title}-${item.link}`}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-soft"
                  >
                    <span className="truncate text-sm font-medium text-foreground">{item.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">View</span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        )}

        <Panel>
          <Tabs tabs={TABS} value={activeView} onChange={setActiveView} />
          <div className="px-5 py-5">
            {activeView === "proposals" && <Proposallist />}
            {activeView === "jobs" && <WorkingJob />}
            {activeView === "completed" && <CompletedJob />}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
