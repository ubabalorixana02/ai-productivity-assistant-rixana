import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { planTasks } from "@/lib/ai.functions";
import { PageHeader, CopyButton } from "@/components/shared";
import { MarkdownView } from "@/components/markdown-view";

export const Route = createFileRoute("/_app/tasks")({
  head: () => ({ meta: [{ title: "Task Planner | AI Workplace" }] }),
  component: TasksPage,
});

function TasksPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!tasks.trim()) {
      toast.error("Enter at least one task");
      return;
    }
    setLoading(true);
    try {
      const { text } = await run({ data: { tasks } });
      setResult(text);
    } catch (err) {
      console.error(err);
      toast.error("Failed to plan tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Task Planner"
        description="Enter your tasks (one per line). Get a prioritized schedule and productivity tips."
      />

      <Card>
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="tasks">Tasks (one per line)</Label>
              <Textarea
                id="tasks"
                rows={10}
                placeholder={"Prepare Q3 report\nReview pull requests\nCall client about renewal\nGym at 6pm"}
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>
            <div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="ml-2">{loading ? "Planning..." : "Plan My Day"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(loading || result) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Plan</CardTitle>
            {result && <CopyButton text={result} />}
          </CardHeader>
          <CardContent>
            {loading && !result ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Building your schedule...
              </div>
            ) : (
              <MarkdownView text={result} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
