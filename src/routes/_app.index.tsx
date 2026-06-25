import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileText, ListChecks, ArrowRight, Sparkles, Zap, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate workplace tasks with AI: write emails, summarize meetings, and plan your day." },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    title: "Smart Email Generator",
    description: "Draft polished, on-tone emails in seconds.",
    href: "/email",
    icon: Mail,
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn long meeting notes into a clean summary, decisions, and action items.",
    href: "/meetings",
    icon: FileText,
  },
  {
    title: "AI Task Planner",
    description: "Prioritize tasks and generate a focused daily schedule.",
    href: "/tasks",
    icon: ListChecks,
  },
] as const;

const stats = [
  { label: "AI-Powered Tools", value: "3", icon: Sparkles },
  { label: "Avg. Time Saved / Task", value: "15m", icon: Clock },
  { label: "Setup Required", value: "None", icon: Zap },
] as const;

function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome back"
        description="Pick a tool to get started. Everything runs on AI — review before you ship."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((f) => (
          <Link key={f.href} to={f.href} className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-md">
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open tool
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
