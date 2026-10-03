import React from 'react';
import { MaxxLogo } from './MaxxLogo';
import { Sparkles, Code2, Feather, Lightbulb, Compass, Smartphone, Zap, ArrowRight } from 'lucide-react';

interface WelcomeHeroProps {
  onSelectPrompt: (promptText: string) => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onSelectPrompt }) => {
  const suggestionCards = [
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      category: 'Présentation & Vision',
      title: 'Présente-toi et explique tes capacités',
      prompt: 'Bonjour MAXX AI ! Présente-toi, explique ton architecture et comment tu peux m\'aider au quotidien.',
    },
    {
      icon: <Code2 className="w-5 h-5 text-blue-400" />,
      category: 'Programmation',
      title: 'Créer un script en JavaScript / TypeScript',
      prompt: 'Peux-tu m\'écrire une fonction moderne en JavaScript pour trier et filtrer des utilisateurs selon leur statut et leur date d\'inscription ?',
    },
    {
      icon: <Feather className="w-5 h-5 text-sky-400" />,
      category: 'Rédaction Pro',
      title: 'Rédiger un e-mail professionnel percutant',
      prompt: 'Rédige un e-mail professionnel et convaincant pour proposer une collaboration stratégique entre deux entreprises technologiques.',
    },
    {
      icon: <Lightbulb className="w-5 h-5 text-amber-400" />,
      category: 'Idées & Stratégie',
      title: 'Idées d\'applications innovantes pour 2026',
      prompt: 'Quelles sont 3 idées de projets d\'applications mobiles prometteuses tirant parti de l\'intelligence artificielle cette année ?',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center text-center animate-fade-in">
      {/* Central Futuristic Hologram Element */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-600/20 to-indigo-600/10 blur-xl"></div>
        <MaxxLogo size="lg" />
      </div>

      {/* Hero Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
        L'Intelligence Artificielle <br className="hidden sm:block" />
        <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
          Nouvelle Génération
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed mb-6 font-normal">
        Bienvenue sur <strong className="text-cyan-300 font-semibold">MAXX AI</strong>, votre assistant intelligent ultra-rapide. Posez vos questions en français, obtenez des réponses claires, du code optimisé et des idées brillantes.
      </p>

      {/* Android Mobile & Tech Badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 font-medium">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          Optimisé pour Android & Mobile
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/30 text-xs text-blue-300 font-medium">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          Réponses en temps réel en français
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-medium">
          <Compass className="w-3.5 h-3.5 text-slate-300" />
          Design futuriste bleu & noir
        </span>
      </div>

      {/* Interactive Suggestion Cards */}
      <div className="w-full text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center justify-between">
          <span>Suggestions pour commencer :</span>
          <span className="text-cyan-400 text-[11px] lowercase">cliquez pour tester</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestionCards.map((card, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(card.prompt)}
              className="p-3.5 sm:p-4 rounded-xl bg-[#060b18]/80 hover:bg-[#0c152d] border border-cyan-950 hover:border-cyan-500/50 transition-all duration-200 text-left cursor-pointer group shadow-md shadow-black/30 hover:shadow-cyan-950/30 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-cyan-950/50 border border-cyan-800/40 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <span className="text-[11px] font-medium text-cyan-400/80 tracking-wide uppercase">
                  {card.category}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-200 mb-1 transition-colors">
                {card.title}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                "{card.prompt}"
              </p>
              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-cyan-400/70 group-hover:text-cyan-300">
                <span>Essayer cette question</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
