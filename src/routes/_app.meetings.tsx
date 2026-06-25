import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { summarizeMeeting } from "@/lib/ai.functions";
import { PageHeader, CopyButton } from "@/components/shared";
import { MarkdownView } from "@/components/markdown-view";

export const Route = createFileRoute("/_app/meetings")({
  head: () => ({ meta: [{ title: "Meeting Summarizer | AI Workplace" }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error("Please paste your meeting notes");
      return;
    }
    setLoading(true);
    try {
      const { text } = await run({ data: { notes } });
      setResult(text);
    } catch (err) {
      console.error(err);
      toast.error("Failed to summarize. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste raw notes to get a structured summary, key decisions, action items, and deadlines."
      />

      <Card>
        <CardHeader>
          <CardTitle>Meeting Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Paste your notes</Label>
              <Textarea
                id="notes"
                rows={12}
                placeholder="Paste full meeting notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="ml-2">{loading ? "Summarizing..." : "Summarize"}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(loading || result) && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Results</CardTitle>
            {result && <CopyButton text={result} />}
          </CardHeader>
          <CardContent>
            {loading && !result ? (
              <div className="flex h-40 items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Analyzing your meeting...
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
