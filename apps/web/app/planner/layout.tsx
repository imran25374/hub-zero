import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Planner", template: "%s | Planner" },
  robots: { index: false, follow: false },
};

export default function PlannerRoot({ children }: LayoutProps<"/planner">) {
  return children;
}
