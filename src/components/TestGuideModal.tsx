import React from 'react';
import { X, Smartphone, Send, MessageSquare, Volume2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { MaxxLogo } from './MaxxLogo';

interface TestGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt: (prompt: string) => void;
}

export const TestGuideModal: React.FC<TestGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt,
}) => {
  if (!isOpen) return null;

  const testCases = [
    {
      label: 'Question générale & culture',
      prompt: 'Explique-moi le fonctionnement des trous noirs en 3 phrases simples.',
      badge: 'Général',
    },
    {
      label: 'Génération de code',
      prompt: 'Écris un script Python pour analyser la fréquence des mots dans un texte.',
      badge: 'Code',
    },
    {
      label: 'Rédaction professionnelle',
      prompt: 'Rédige une proposition commerciale concise pour des services de cybersécurité.',
      badge: 'Pro',
    },
    {
      label: 'Test de logique & créativité',
      prompt: 'Propose-moi 3 idées de fonctionnalités futuristes pour une montre connectée en 2030.',
      badge: 'Créatif',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#060a16] border border-cyan-500/40 p-5 sm:p-6 shadow-2xl shadow-cyan-950/60 text-slate-100 scrollbar-thin">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <MaxxLogo size="sm" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              Guide de Test de MAXX AI
            </h2>
            <p className="text-xs text-cyan-300">Comment tester et profiter de toutes les fonctionnalités</p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4 mb-6 text-sm">
          {/* Step 1: Poser une question */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#091124] border border-cyan-900/40">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                1. Écrire une question & Envoyer
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tapez votre question en bas dans la <strong>zone de saisie</strong>, puis cliquez sur le bouton cyan <strong className="text-cyan-300">Envoyer</strong> (ou appuyez sur la touche Entrée).
              </p>
            </div>
          </div>

          {/* Step 2: Test sur téléphone Android */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#091124] border border-cyan-900/40">
            <div className="p-2 rounded-lg bg-blue-950 text-blue-400 shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                2. Tester sur smartphone Android
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                L'interface utilise une hauteur adaptative (<code>100dvh</code>) et des zones tactiles ergonomiques. Ouvrez l'application sur le navigateur Chrome de votre téléphone Android : la barre de saisie reste accessible même avec le clavier virtuel ouvert.
              </p>
            </div>
          </div>

          {/* Step 3: Barre de raccourcis Quick Actions */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#091124] border border-cyan-900/40">
            <div className="p-2 rounded-lg bg-teal-950 text-teal-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                3. Raccourcis rapides (Quick Actions)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utilisez les boutons rapides sous la zone de saisie (<strong>Traduis ce texte</strong>, <strong>Résume ceci</strong>, <strong>Corrige l'orthographe</strong>). Ils pré-remplissent la question ou traitent directement le texte saisi.
              </p>
            </div>
          </div>

          {/* Step 4: Écoute audio et dictée vocale */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#091124] border border-cyan-900/40">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                4. Lecture audio & Reconnaissance vocale
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                - Cliquez sur l'icône de haut-parleur sur n'importe quel message pour <strong>écouter la réponse lue à voix haute en français</strong>.<br />
                - Cliquez sur le <strong>micro</strong> pour dicter votre question à la voix sans avoir à taper.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Click-to-Test Prompts */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Cliquez sur un exemple pour le tester immédiatement :
          </p>
          <div className="space-y-2">
            {testCases.map((tc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onSelectPrompt(tc.prompt);
                  onClose();
                }}
                className="w-full text-left p-2.5 rounded-lg bg-[#070e1e] hover:bg-cyan-950/40 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between text-xs group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/50 text-cyan-400 text-[10px] font-mono">
                    {tc.badge}
                  </span>
                  <span className="text-slate-300 group-hover:text-cyan-200 font-medium">
                    {tc.prompt}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            Prêt à répondre 24h/24 en français
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            Compris, commencer
          </button>
        </div>
      </div>
    </div>
  );
};
