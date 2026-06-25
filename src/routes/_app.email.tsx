import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generateEmail } from "@/lib/ai.functions";
import { PageHeader, CopyButton } from "@/components/shared";

export const Route = createFileRoute("/_app/email")({
  head: () => ({ meta: [{ title: "Email Generator | AI Workplace" }] }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState("Formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!recipient.trim() || !purpose.trim()) {
      toast.error("Recipient and purpose are required");
      return;
    }
    setLoading(true);
    try {
      const { text } = await run({ data: { recipient, purpose, tone } });
      setResult(text);
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Smart Email Generator" description="Generate a professional email from a few inputs." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient">Recipient</Label>
                <Input
                  id="recipient"
                  placeholder="e.g. Sarah Chen, Engineering Manager"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="purpose">Email Purpose</Label>
                <Textarea
                  id="purpose"
                  placeholder="Briefly describe what the email should accomplish..."
                  rows={5}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Friendly">Friendly</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="ml-2">{loading ? "Generating..." : "Generate Email"}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Email</CardTitle>
            {result && <CopyButton text={result} />}
          </CardHeader>
          <CardContent>
            {loading && !result ? (
              <div className="flex h-72 items-center justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Writing your email...
              </div>
            ) : result ? (
              <Textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={16}
                className="font-mono text-sm"
              />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-muted-foreground text-center px-6">
                Your generated email will appear here. You can edit it before copying.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
