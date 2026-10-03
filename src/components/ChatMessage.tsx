import React, { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { MaxxLogo } from './MaxxLogo';
import { User, Copy, Check, Volume2, VolumeX, Sparkles, RefreshCw } from 'lucide-react';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
  isSpeaking: boolean;
  onSpeak: (text: string, id: string) => void;
  onStopSpeaking: () => void;
  onRetry?: (text: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isSpeaking,
  onSpeak,
  onStopSpeaking,
  onRetry,
}) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'model';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      onStopSpeaking();
    } else {
      onSpeak(message.text, message.id);
    }
  };

  return (
    <div
      className={`w-full py-3.5 px-3 sm:px-4 transition-colors ${
        isAssistant ? 'bg-[#040814]/70 border-y border-cyan-950/40' : 'bg-transparent'
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isAssistant ? (
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#030712] border border-cyan-400/50 flex items-center justify-center p-1 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 border border-blue-400/40 flex items-center justify-center text-white shadow-md shadow-blue-900/40">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-100" />
            </div>
          )}
        </div>

        {/* Content & Metadata */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold tracking-wide text-white">
                {isAssistant ? (
                  <span className="flex items-center gap-1.5 text-cyan-300">
                    MAXX AI
                    <span className="text-[10px] px-1.5 py-0.2 font-mono font-medium rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-400">
                      V3.8
                    </span>
                  </span>
                ) : (
                  <span className="text-slate-300">Vous</span>
                )}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {message.timestamp}
              </span>
            </div>

            {/* Quick Actions (Copy / TTS) for Assistant */}
            {isAssistant && !message.isStreaming && message.text && (
              <div className="flex items-center gap-1">
                {/* Speech Button */}
                <button
                  type="button"
                  onClick={toggleSpeech}
                  title={isSpeaking ? 'Arrêter la lecture' : 'Écouter la réponse en français'}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-cyan-500/20 text-cyan-300 animate-pulse border border-cyan-400/40'
                      : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
                  }`}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  title="Copier le message"
                  className="p-1.5 rounded-md text-xs text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Text / Markdown Render */}
          <div className="overflow-hidden">
            {isAssistant ? (
              <MarkdownRenderer content={message.text} isStreaming={message.isStreaming} />
            ) : (
              <p className="text-sm sm:text-[15px] text-slate-100 whitespace-pre-wrap leading-relaxed">
                {message.text}
              </p>
            )}
          </div>

          {/* Audio Speaking indicator */}
          {isAssistant && isSpeaking && (
            <div className="mt-2 flex items-center gap-2 text-xs text-cyan-300 font-medium">
              <span className="flex gap-1 items-end h-3">
                <span className="w-1 bg-cyan-400 h-2 animate-bounce"></span>
                <span className="w-1 bg-cyan-400 h-3 animate-bounce [animation-delay:0.15s]"></span>
                <span className="w-1 bg-cyan-400 h-1.5 animate-bounce [animation-delay:0.3s]"></span>
              </span>
              <span>Lecture audio en cours...</span>
              <button
                type="button"
                onClick={onStopSpeaking}
                className="text-[11px] underline text-cyan-400/80 hover:text-cyan-200 cursor-pointer ml-1"
              >
                Arrêter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
