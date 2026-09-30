import React from 'react';
import { useDualDev } from '../context/DualDevContext';
import { tracks } from '../data/tracks';
import { getLessonsByTrack } from '../data/lessons';
import { LanguageIcon } from '../components/LanguageIcon';
import { TrackId } from '../types';
import { 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Database,
  Check,
  Zap
} from 'lucide-react';

const TRACK_HERO_CONTENT: Record<TrackId, {
  highlight: string;
  headline: string;
  description: string;
}> = {
  java: {
    highlight: 'Java',
    headline: 'e a programação orientada a objetos na prática.',
    description: 'Execute seu código diretamente no navegador. Aprenda a anatomia da classe Java, o método main, métodos com parâmetros tipados e manipulação de arrays e strings com feedback imediato no console.',
  },
  python: {
    highlight: 'Python',
    headline: 'e a sintaxe limpa de inteligência artificial e scripts.',
    description: 'Escreva código limpo, conciso e elegante. Domine a função print, controle de fluxo com if/elif/else, listas dinâmicas, laços for in, funções reutilizáveis e contadores com range().',
  },
  javascript: {
    highlight: 'JavaScript',
    headline: 'e o ecossistema moderno da Web interativa.',
    description: 'Aprenda a linguagem que move a web moderna: variáveis com escopo seguro (let/const), template literals, arrow functions, programação funcional com map/filter e desestruturação de objetos.',
  },
  html: {
    highlight: 'HTML5',
    headline: 'e a estruturação semântica e acessível da Web.',
    description: 'A base de qualquer aplicação online: crie páginas estruturadas com cabeçalhos semânticos, menus de navegação, formulários interativos, tabelas de dados e mídias acessíveis.',
  },
  css: {
    highlight: 'CSS3',
    headline: 'e o design responsivo de interfaces modernas.',
    description: 'Transforme código em designs marcantes: domine o Box Model, alinhamentos com Flexbox, layouts bidimensionais com CSS Grid, tipografia, microinterações e transições fluidas.',
  },
};

const ICONS_BY_CATEGORY: Record<string, React.FC<any>> = {
  Fundamentos: Cpu,
  'Estrutura Básica': Cpu,
  'Estruturação Web': Layers,
  'Estruturas de Dados': Database,
  'Controle de Fluxo': Layers,
  Funções: Layers,
  Modularização: Layers,
  Layout: Layers,
  'Estilos e Design': Database,
};

export const HomePage: React.FC = () => {
  const { 
    setActiveTab, 
    currentTrackId,
    setCurrentTrackId, 
    setCurrentLessonId, 
    completedLessonIds, 
    missions
  } = useDualDev();

  const currentTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];
  const activeTrackLessons = getLessonsByTrack(currentTrackId);
  const heroInfo = TRACK_HERO_CONTENT[currentTrackId] || TRACK_HERO_CONTENT.java;

  const handleSelectTrack = (trackId: TrackId) => {
    setCurrentTrackId(trackId);
    const trackLessons = getLessonsByTrack(trackId);
    if (trackLessons.length > 0) {
      setCurrentLessonId(trackLessons[0].id);
    }
  };

  const handleEnterAcademia = (lessonId?: string) => {
    if (lessonId) {
      setCurrentLessonId(lessonId);
    } else if (activeTrackLessons.length > 0) {
      setCurrentLessonId(activeTrackLessons[0].id);
    }
    setActiveTab('academia');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
      
      {/* Hero Welcome Banner (Dynamically updates with currentTrackId) */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-200/80 dark:border-purple-950/70 bg-gradient-to-br from-purple-100/70 via-indigo-50/50 to-white dark:from-[#180f2d] dark:via-[#120a22] dark:to-[#0a0614] p-6 sm:p-10 shadow-2xl transition-colors">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-mono font-medium">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>DualDev Academy • Trilha {currentTrack.name} Ativa</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Domine{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-300">
              {heroInfo.highlight}
            </span>{' '}
            {heroInfo.headline}
          </h1>

          <p className="text-slate-600 dark:text-purple-200/80 text-sm sm:text-base leading-relaxed">
            {heroInfo.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => handleEnterAcademia()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Acessar Academia {currentTrack.name}</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#170f2a] hover:bg-purple-50 dark:hover:bg-[#1f1438] text-slate-800 dark:text-purple-200 font-medium text-sm border border-purple-200 dark:border-purple-900/60 shadow-sm transition-colors"
            >
              <Code2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Playground Livre</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
      </div>

      {/* Featured Spotlight: Top Modules of the Current Active Track */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="text-purple-600 dark:text-purple-400">⚡</span>
              <span>Destaques da Trilha {currentTrack.name}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-purple-300/60 mt-0.5">
              {activeTrackLessons.length} exercícios práticos com execução no navegador e testes em tempo real:
            </p>
          </div>

          <button
            onClick={() => handleEnterAcademia()}
            className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
          >
            <span>Ver todas as {activeTrackLessons.length} lições</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTrackLessons.slice(0, 3).map((item) => {
            const Icon = ICONS_BY_CATEGORY[item.category] || Cpu;
            const isCompleted = completedLessonIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleEnterAcademia(item.id)}
                className="group relative cursor-pointer rounded-xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#130d22] hover:border-purple-400 dark:hover:border-purple-600 p-5 shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" />
                      Concluído
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-[#19102c] px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800/60">
                      +{item.xp} XP
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono uppercase tracking-wider text-purple-600/70 dark:text-purple-400/70 mb-1">
                  {currentTrack.name} • {item.category}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-purple-200/70 leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <span>Praticar exercício</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Tracks + Daily Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* All Available Tracks (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Trilhas de Aprendizagem
            </h2>
            <span className="text-xs text-slate-500 dark:text-purple-300/60 font-mono">
              Clique em uma trilha para ativá-la
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tracks.map((t) => {
              const isSelected = t.id === currentTrackId;

              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTrack(t.id)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all shadow-sm relative ${
                    isSelected
                      ? 'border-purple-500 dark:border-purple-500 bg-purple-50/70 dark:bg-[#1a1130] ring-2 ring-purple-500/20'
                      : 'border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#130d22] hover:border-purple-400 dark:hover:border-purple-600'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-600 text-white shadow-sm">
                      <Check className="h-3 w-3" />
                      <span>Ativa</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <LanguageIcon trackId={t.id} className="w-5 h-5" />
                      <span className="text-base font-bold text-slate-900 dark:text-white">{t.name}</span>
                    </div>
                    {!isSelected && (
                      <span className="text-[11px] font-mono text-slate-500 dark:text-purple-300/60">
                        {t.totalLessons} lições
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-purple-200/70 leading-relaxed mb-3">
                    {t.tagline}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/60 pt-2 border-t border-purple-100 dark:border-purple-950/80">
                    <span className="font-mono text-purple-600 dark:text-purple-400 font-semibold">{t.totalXp} XP • {t.totalLessons} aulas</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTrack(t.id);
                        setActiveTab('academia');
                      }}
                      className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Entrar</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Missions Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Missões Diárias
            </h2>
            <span className="text-xs text-slate-500 dark:text-purple-300/50 font-mono">Reinicia à 00:00</span>
          </div>

          <div className="space-y-3">
            {missions.map((m) => {
              const progressPct = Math.round((m.progress / m.target) * 100);

              return (
                <div
                  key={m.id}
                  className="rounded-xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#130d22] p-4 space-y-2.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs text-slate-800 dark:text-purple-100">
                      {m.title}
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 flex items-center gap-0.5">
                      <Zap className="h-3 w-3 fill-purple-600 dark:fill-purple-400" />
                      +{m.xpReward} XP
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-purple-200/70 leading-normal">
                    {m.description}
                  </p>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-purple-300/60">
                      <span>Progresso</span>
                      <span>
                        {m.progress}/{m.target}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-purple-100 dark:bg-purple-950/80 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          m.completed ? 'bg-emerald-500' : 'bg-purple-600 dark:bg-purple-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
