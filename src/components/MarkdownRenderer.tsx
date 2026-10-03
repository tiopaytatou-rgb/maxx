import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isStreaming }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = async (codeText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  // Split content by code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];

  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index),
      });
    }

    parts.push({
      type: 'code',
      language: match[1] || 'texte',
      content: match[2].trimEnd(),
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex),
    });
  }

  // If content is empty
  if (parts.length === 0) {
    return <p className="text-slate-400 italic">En attente de réponse...</p>;
  }

  // Render normal formatted text lines
  const renderTextSegment = (text: string, segKey: string) => {
    const lines = text.split('\n');

    return (
      <div key={segKey} className="space-y-2">
        {lines.map((line, lineIdx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={lineIdx} className="h-2" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={lineIdx} className="text-base font-semibold text-cyan-300 mt-3 mb-1">
                {renderInlineStyles(trimmed.slice(4))}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={lineIdx} className="text-lg font-bold text-cyan-200 mt-4 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-cyan-400 rounded-full inline-block"></span>
                {renderInlineStyles(trimmed.slice(3))}
              </h3>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h2 key={lineIdx} className="text-xl font-extrabold text-cyan-100 mt-4 mb-2">
                {renderInlineStyles(trimmed.slice(2))}
              </h2>
            );
          }

          // Blockquotes
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={lineIdx} className="border-l-2 border-cyan-500/60 pl-3 py-1 my-1 italic text-slate-300 bg-cyan-950/20 rounded-r">
                {renderInlineStyles(trimmed.slice(2))}
              </blockquote>
            );
          }

          // Unordered Lists
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div key={lineIdx} className="flex items-start gap-2.5 ml-2 text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <span className="leading-relaxed">{renderInlineStyles(trimmed.slice(2))}</span>
              </div>
            );
          }

          // Ordered Lists
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
          if (numMatch) {
            return (
              <div key={lineIdx} className="flex items-start gap-2.5 ml-2 text-slate-200">
                <span className="text-cyan-400 font-mono text-sm font-semibold mt-0.5 shrink-0">
                  {numMatch[1]}.
                </span>
                <span className="leading-relaxed">{renderInlineStyles(numMatch[2])}</span>
              </div>
            );
          }

          // Regular paragraph
          return (
            <p key={lineIdx} className="leading-relaxed text-slate-200">
              {renderInlineStyles(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Helper for bold, italic, and inline code
  const renderInlineStyles = (raw: string): React.ReactNode[] => {
    // Tokenize inline code first: `code`
    const inlineTokens = raw.split(/(`[^`]+`)/g);

    return inlineTokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 mx-0.5 text-xs font-mono font-medium rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50"
          >
            {token.slice(1, -1)}
          </code>
        );
      }

      // Tokenize bold: **bold**
      const boldTokens = token.split(/(\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={i}>
          {boldTokens.map((bToken, j) => {
            if (bToken.startsWith('**') && bToken.endsWith('**') && bToken.length > 4) {
              return (
                <strong key={j} className="font-semibold text-cyan-100">
                  {bToken.slice(2, -2)}
                </strong>
              );
            }
            // Tokenize italic: *italic*
            const italicTokens = bToken.split(/(\*[^*]+\*)/g);
            return (
              <React.Fragment key={j}>
                {italicTokens.map((itToken, k) => {
                  if (itToken.startsWith('*') && itToken.endsWith('*') && itToken.length > 2) {
                    return <em key={k} className="italic text-slate-300">{itToken.slice(1, -1)}</em>;
                  }
                  return itToken;
                })}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="text-sm md:text-[15px] space-y-3 font-normal selection:bg-cyan-500/30">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <div
              key={index}
              className="my-3 rounded-lg overflow-hidden border border-cyan-900/60 bg-[#080d1a] shadow-lg shadow-black/40"
            >
              <div className="flex items-center justify-between px-3.5 py-2 bg-[#050914] border-b border-cyan-950/80 text-xs text-slate-400">
                <span className="font-mono text-cyan-400 font-medium lowercase flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400/80 inline-block"></span>
                  {part.language}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyCode(part.content, index)}
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded bg-cyan-950/50 hover:bg-cyan-900/50 text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer border border-cyan-800/40 text-xs"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-3.5 overflow-x-auto text-xs md:text-sm font-mono text-cyan-100 bg-[#060b17] leading-relaxed">
                <pre>{part.content}</pre>
              </div>
            </div>
          );
        }

        return renderTextSegment(part.content, `text-${index}`);
      })}

      {isStreaming && (
        <span className="inline-block w-2 h-4 ml-1 bg-cyan-400 animate-pulse align-middle rounded-sm"></span>
      )}
    </div>
  );
};
