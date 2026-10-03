import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Square,
  Sparkles,
  X,
  Languages,
  FileText,
  CheckCheck,
  Code,
  Zap,
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  promptPrefix: string;
  getFormattedPrompt: (currentText: string) => string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onStop }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea according to content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [text]);

  // Voice speech-to-text setup (useful on Android Chrome / Web)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("La reconnaissance vocale n'est pas supportée par ce navigateur. Vous pouvez saisir votre question au clavier.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Erreur démarrage micro:', err);
        setIsListening(false);
      }
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;

    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift) on desktop / tablet
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Predefined Quick Actions under the input zone
  const quickActions: QuickAction[] = [
    {
      id: 'translate',
      label: 'Traduis ce texte',
      icon: <Languages className="w-3.5 h-3.5 text-cyan-400" />,
      promptPrefix: 'Traduis ce texte',
      getFormattedPrompt: (cur) =>
        cur.trim()
          ? `Traduis ce texte en français (ou en anglais si déjà en français) :\n\n"${cur.trim()}"`
          : 'Traduis ce texte : ',
    },
    {
      id: 'summarize',
      label: 'Résume ceci',
      icon: <FileText className="w-3.5 h-3.5 text-blue-400" />,
      promptPrefix: 'Résume ceci',
      getFormattedPrompt: (cur) =>
        cur.trim()
          ? `Résume ceci de manière claire, concise et structurée en 3 points essentiels :\n\n"${cur.trim()}"`
          : 'Résume ceci de façon claire et synthétique : ',
    },
    {
      id: 'proofread',
      label: "Corrige l'orthographe",
      icon: <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />,
      promptPrefix: "Corrige l'orthographe",
      getFormattedPrompt: (cur) =>
        cur.trim()
          ? `Corrige l'orthographe, la grammaire et le style du texte suivant, puis détaille les améliorations apportées :\n\n"${cur.trim()}"`
          : "Corrige l'orthographe et la grammaire de ce texte : ",
    },
    {
      id: 'explain',
      label: 'Explique simplement',
      icon: <Sparkles className="w-3.5 h-3.5 text-purple-400" />,
      promptPrefix: 'Explique simplement',
      getFormattedPrompt: (cur) =>
        cur.trim()
          ? `Explique ceci de façon simple, claire et accessible avec un exemple concret :\n\n"${cur.trim()}"`
          : 'Explique ce concept simplement : ',
    },
    {
      id: 'code',
      label: 'Génère du code',
      icon: <Code className="w-3.5 h-3.5 text-teal-400" />,
      promptPrefix: 'Génère du code',
      getFormattedPrompt: (cur) =>
        cur.trim()
          ? `Génère du code propre, commenté et optimisé pour :\n\n"${cur.trim()}"`
          : 'Génère du code propre et commenté pour : ',
    },
  ];

  const handleApplyQuickAction = (action: QuickAction) => {
    const newText = action.getFormattedPrompt(text);
    setText(newText);

    // Put focus on textarea and position cursor at end
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.value.length;
        textareaRef.current.selectionEnd = textareaRef.current.value.length;
      }
    }, 50);
  };

  return (
    <div className="w-full bg-[#030712]/95 backdrop-blur-xl border-t border-cyan-500/20 px-3 sm:px-6 pt-2 pb-3 sm:pb-4 safe-area-pb">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Input Box Card */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 rounded-2xl bg-[#070c1b] border border-cyan-500/30 p-2 sm:p-2.5 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 shadow-lg shadow-black/50 transition-all"
        >
          {/* Voice Input Button (Mic) */}
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Arrêter le micro' : 'Dicter en français'}
            className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/50 animate-pulse'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-cyan-950/40'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Text Area */}
          <div className="flex-1 relative flex items-center">
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isListening ? 'Écoute en cours... parlez maintenant' : 'Posez votre question à MAXX AI...'
              }
              className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm sm:text-base resize-none focus:outline-none py-1.5 px-1 max-h-[140px] leading-relaxed scrollbar-thin"
            />

            {/* Clear Button */}
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="p-1 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer mr-1"
                title="Effacer le texte"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Send or Stop Button */}
          {isLoading ? (
            <button
              type="button"
              onClick={onStop}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-rose-950 cursor-pointer shrink-0"
              title="Arrêter la réponse"
            >
              <Square className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Arrêter</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!text.trim()}
              className={`flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shrink-0 cursor-pointer ${
                text.trim()
                  ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.5)] active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              }`}
            >
              <span>Envoyer</span>
              <Send className={`w-4 h-4 ${text.trim() ? 'translate-x-0.5' : ''}`} />
            </button>
          )}
        </form>

        {/* Barre de raccourcis rapide (Quick Actions) SOUS la zone de saisie */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 select-none">
          <div className="flex items-center gap-1 px-1.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/30 text-[10px] font-bold text-cyan-400 tracking-wider shrink-0 uppercase">
            <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Quick Actions</span>
          </div>

          {quickActions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleApplyQuickAction(action)}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#080f24] hover:bg-[#0f1d47] active:bg-[#15275e] text-slate-200 hover:text-cyan-200 border border-cyan-900/50 hover:border-cyan-400/60 text-xs font-medium transition-all shadow-sm cursor-pointer group"
            >
              <span className="p-0.5 rounded group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {/* Mobile keyboard & safety hints */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-0.5">
          <span className="hidden sm:inline">
            Appuyez sur <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">Entrée</kbd> pour envoyer, <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">Maj + Entrée</kbd> pour sauter une ligne
          </span>
          <span className="sm:hidden text-cyan-400/80 font-medium">
            MAXX AI • Mobile Android Ready
          </span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>Réponses en français</span>
          </span>
        </div>
      </div>
    </div>
  );
};
