import { useState, useRef, useEffect } from "react";
import { cn } from '@/utils/common.utils';;
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
  fileName?: string;
  showLineNumbers?: boolean;
  className?: string;
};

// Syntax highlighting colors
const syntaxColors = {
  comment: "text-muted-foreground",
  keyword: "text-primary-400",
  string: "text-green-400",
  function: "text-blue-400",
  variable: "text-foreground",
  type: "text-orange-400",
};

// Simple syntax highlighting function
function formatCode(code: string): React.ReactNode {
  // Split the code by newlines
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    // Replace patterns with span elements for basic syntax highlighting
    let formattedLine = line
      // Comments
      .replace(/(\/\/.*$)/g, `<span class="${syntaxColors.comment}">$1</span>`)
      // Keywords
      .replace(
        /(import|export|const|let|function|return|if|async|await|new|from|class)/g,
        `<span class="${syntaxColors.keyword}">$1</span>`
      )
      // Strings
      .replace(
        /(['"`])(.*?)(['"`])/g,
        `<span class="${syntaxColors.string}">$1$2$3</span>`
      )
      // Function calls
      .replace(
        /(\w+)(\()/g,
        `<span class="${syntaxColors.function}">$1</span>$2`
      )
      // Types
      .replace(
        /(\w+)(\.)/g,
        `<span class="${syntaxColors.type}">$1</span>$2`
      );

    return (
      <div key={lineIndex} className="flex">
        {/* Line number */}
        {lineIndex + 1}
        {/* Code content */}
        <div 
          className="flex-1 pl-4" 
          dangerouslySetInnerHTML={{ __html: formattedLine }} 
        />
      </div>
    );
  });
}

export default function CodeBlock({
  code,
  language = "typescript",
  fileName = "index.ts",
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={cn("rounded-xl bg-card overflow-hidden shadow-lg border border-border/50", className)}>
      {/* Code editor header */}
      <div className="flex items-center px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-center flex-1 text-xs text-muted-foreground">{fileName}</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={copyToClipboard}
          title="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      {/* Code content */}
      <pre
        ref={codeRef}
        className="font-mono text-sm p-4 overflow-x-auto"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {formatCode(code)}
      </pre>
    </div>
  );
}
