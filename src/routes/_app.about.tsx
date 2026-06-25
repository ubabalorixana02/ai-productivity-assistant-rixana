import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Zap, Brain, Clock, ShieldCheck, Workflow } from "lucide-react";
import { PageHeader } from "@/components/shared";

export const Route = createFileRoute("/_app/about")({
  head: () => ({
    meta: [
      { title: "About | AI Workplace Productivity Assistant" },
      { name: "description", content: "How AI improves workplace productivity and the benefits of automation." },
    ],
  }),
  component: AboutPage,
});

const benefits = [
  { icon: Clock, title: "Save Time", text: "Automate repetitive writing, summarizing, and planning so you can focus on high-value work." },
  { icon: Brain, title: "Reduce Cognitive Load", text: "Offload structure and formatting to AI; keep your energy for judgment and decisions." },
  { icon: Zap, title: "Move Faster", text: "Go from raw notes to clear action items in seconds, not hours." },
  { icon: Workflow, title: "Consistent Quality", text: "Standardized tone, structured outputs, and reliable formatting every time." },
  { icon: ShieldCheck, title: "Stay In Control", text: "All outputs are editable — you remain the author of every message and decision." },
];

function AboutPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="About this project"
        description="An AI-powered productivity workspace built to help professionals get more done."
      />

      <Card>
        <CardHeader>
          <CardTitle>How AI improves workplace productivity</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-foreground">
          <p className="text-sm text-muted-foreground leading-relaxed">
            The modern workplace is full of small but time-consuming tasks: writing emails, taking and
            summarizing meeting notes, prioritizing to-dos, and planning a realistic day. Each one is simple
            on its own, but together they erode the time and focus you have for meaningful work.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-3">
            AI Workplace Productivity Assistant uses large language models to handle the mechanical part of
            these tasks — drafting, structuring, summarizing, and prioritizing — while leaving the judgment
            calls to you. The result: faster execution, clearer communication, and more deliberate days.
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-semibold mb-4">Benefits of automation</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <Card key={b.title}>
              <CardHeader>
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <b.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base mt-2">{b.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Responsible AI Disclaimer</AlertTitle>
        <AlertDescription>
          This application uses artificial intelligence to assist with workplace productivity tasks. Users
          should review all AI-generated content before using it in professional environments.
        </AlertDescription>
      </Alert>
    </div>
  );
}
