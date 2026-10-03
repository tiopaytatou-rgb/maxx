import React from 'react';
import { MaxxLogo } from './MaxxLogo';
import { Sparkles, Trash2, HelpCircle, Volume2, VolumeX, Smartphone, Cpu } from 'lucide-react';

interface HeaderProps {
  onClearChat: () => void;
  onOpenTestGuide: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onClearChat,
  onOpenTestGuide,
  voiceEnabled,
  onToggleVoice,
  hasMessages,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-cyan-500/20 bg-[#030712]/90 backdrop-blur-md px-3 sm:px-6 py-2.5 sm:py-3 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Status */}
        <div className="flex items-center gap-3">
          <MaxxLogo size="md" />

          {/* Online system badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] text-cyan-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-medium tracking-wide">SYSTÈME EN LIGNE</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Voice Audio Toggle */}
          <button
            type="button"
            onClick={onToggleVoice}
            title={voiceEnabled ? 'Lecture vocale activée' : 'Lecture vocale désactivée'}
            className={`p-2 rounded-lg transition-all border cursor-pointer ${
              voiceEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4 text-cyan-300" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* How to test button */}
          <button
            type="button"
            onClick={onOpenTestGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 text-xs font-medium transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Comment tester</span>
            <span className="sm:hidden">Guide</span>
          </button>

          {/* Clear conversation if messages exist */}
          {hasMessages && (
            <button
              type="button"
              onClick={onClearChat}
              title="Nouvelle conversation"
              className="p-2 sm:px-2.5 sm:py-2 rounded-lg bg-slate-900/80 hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/60 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden md:inline">Effacer</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
