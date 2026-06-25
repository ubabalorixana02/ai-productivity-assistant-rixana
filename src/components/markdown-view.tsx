// Lightweight markdown renderer for AI outputs (headings, lists, bold).
// Not a full markdown spec — just enough for our structured AI outputs.

function renderInline(text: string) {
  // Bold **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}

export function MarkdownView({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let orderedBuffer: string[] = [];

  const flushUl = () => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={blocks.length} className="list-disc pl-6 space-y-1 text-sm text-foreground">
          {listBuffer.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
        </ul>,
      );
      listBuffer = [];
    }
  };
  const flushOl = () => {
    if (orderedBuffer.length) {
      blocks.push(
        <ol key={blocks.length} className="list-decimal pl-6 space-y-1 text-sm text-foreground">
          {orderedBuffer.map((item, i) => <li key={i}>{renderInline(item)}</li>)}
        </ol>,
      );
      orderedBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushUl();
      flushOl();
      continue;
    }
    if (line.startsWith("### ")) {
      flushUl(); flushOl();
      blocks.push(<h3 key={blocks.length} className="text-sm font-semibold mt-4 mb-1">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      flushUl(); flushOl();
      blocks.push(<h2 key={blocks.length} className="text-base font-semibold text-foreground mt-5 mb-2 border-b border-border pb-1">{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      flushUl(); flushOl();
      blocks.push(<h1 key={blocks.length} className="text-lg font-semibold mt-5 mb-2">{line.slice(2)}</h1>);
    } else if (/^\s*[-*]\s+/.test(line)) {
      flushOl();
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ""));
    } else if (/^\s*\d+\.\s+/.test(line)) {
      flushUl();
      orderedBuffer.push(line.replace(/^\s*\d+\.\s+/, ""));
    } else {
      flushUl(); flushOl();
      blocks.push(<p key={blocks.length} className="text-sm text-foreground leading-relaxed">{renderInline(line)}</p>);
    }
  }
  flushUl();
  flushOl();

  return <div className="flex flex-col gap-1">{blocks}</div>;
}
