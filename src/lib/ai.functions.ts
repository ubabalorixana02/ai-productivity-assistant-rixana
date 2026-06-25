import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const MODEL = "google/gemini-3-flash-preview";

function getGateway() {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key);
}

const EmailInput = z.object({
  recipient: z.string().trim().min(1).max(200),
  purpose: z.string().trim().min(1).max(2000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
});

const MeetingInput = z.object({
  notes: z.string().trim().min(1).max(20000),
});

const TasksInput = z.object({
  tasks: z.string().trim().min(1).max(10000),
});

export const generateEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = getGateway();
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are a professional email writing assistant. Write clear, well-structured emails. Output only the email body, including subject line at the top in the format 'Subject: ...' followed by the body. Do not include any markdown or explanations.",
      prompt: `Write an email to: ${data.recipient}\nPurpose: ${data.purpose}\nTone: ${data.tone}`,
    });
    return { text };
  });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = getGateway();
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are an expert meeting analyst. Given raw meeting notes, output Markdown with exactly these four sections in this order: '## Summary', '## Key Decisions', '## Action Items', '## Deadlines'. Use bullet lists under each section. Be concise and specific. If a section has nothing, write '- None identified'.",
      prompt: data.notes,
    });
    return { text };
  });

export const planTasks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TasksInput.parse(input))
  .handler(async ({ data }) => {
    const gateway = getGateway();
    const { text } = await generateText({
      model: gateway(MODEL),
      system:
        "You are an AI productivity coach. Given a list of tasks, output Markdown with exactly these three sections: '## Priority Ranking' (numbered list, highest first, each with a brief why), '## Suggested Schedule' (a realistic daily timeline with time blocks like '9:00 - 10:30'), '## Productivity Recommendations' (3-5 actionable tips). Be concrete and concise.",
      prompt: data.tasks,
    });
    return { text };
  });
