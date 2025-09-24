import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

const CodeBlock = ({ code, language = "solidity", title }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="bg-code-bg border-code-border overflow-hidden">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-code-border bg-muted/30">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground capitalize">{language}</span>
            <Button
              onClick={handleCopy}
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 hover:bg-primary/10"
            >
              {copied ? (
                <Check className="h-3 w-3 text-success" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      )}
      <div className="relative">
        <pre className="p-4 text-sm overflow-x-auto">
          <code className="text-foreground font-mono leading-relaxed">
            {code}
          </code>
        </pre>
        {!title && (
          <Button
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-70 hover:opacity-100 hover:bg-primary/10"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CodeBlock;