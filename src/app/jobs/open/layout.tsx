import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Freelance Jobs",
  description: "Browse the latest open freelance job listings on FreelanceBase. Submit proposals and connect with top clients.",
};

export default function OpenJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
