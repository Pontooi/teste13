import React from 'react';
import { useDualDev } from '../context/DualDevContext';
import { tracks } from '../data/tracks';
import { LanguageIcon } from './LanguageIcon';
import { 
  Code2, 
  BookOpen, 
  Flame, 
  Zap, 
  Trophy, 
  Info, 
  Terminal, 
  Compass, 
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userXp, 
    userLevel, 
    streak, 
    currentTrackId, 
    setCurrentTrackId,
    theme,
    toggleTheme,
  } = useDualDev();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-200/70 dark:border-purple-950/60 bg-white/90 dark:bg-[#0c0814]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Logo & Platform Brand */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('inicio')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Code2 className="h-5 w-5 font-bold stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-slate-900 dark:text-white text-base">
                <span>Dual</span>
                <span className="text-purple-600 dark:text-purple-400">Dev</span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-700 dark:text-purple-300 px-1 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800/60">
                  Academia
                </span>
              </div>
            </div>
          </button>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('inicio')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'inicio'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Compass className="h-4 w-4" />
              Início
            </button>

            <button
              onClick={() => setActiveTab('academia')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'academia'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Academia
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'playground'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Terminal className="h-4 w-4" />
              Playground
            </button>

            <button
              onClick={() => setActiveTab('conquistas')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'conquistas'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Trophy className="h-4 w-4" />
              Conquistas
            </button>

            <button
              onClick={() => setActiveTab('sobre')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sobre'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/40'
              }`}
            >
              <Info className="h-4 w-4" />
              Sobre
            </button>
          </nav>
        </div>

        {/* Controls, Theme Switcher & Stats */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Quick Track Switcher Dropdown */}
          <div className="relative flex items-center">
            <div className="absolute left-2.5 pointer-events-none">
              <LanguageIcon trackId={currentTrackId} className="w-4 h-4" />
            </div>
            <select
              value={currentTrackId}
              onChange={(e) => setCurrentTrackId(e.target.value as any)}
              className="appearance-none bg-purple-50/50 dark:bg-[#140e24] border border-purple-200 dark:border-purple-900/50 hover:border-purple-400 dark:hover:border-purple-700 text-slate-800 dark:text-purple-100 text-xs font-mono font-medium py-1.5 pl-8 pr-7 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro (padrão)'}
            aria-label="Alternar tema"
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-[#140e24] text-slate-700 dark:text-purple-300 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-100/60 dark:hover:bg-purple-900/40 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-300 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="h-4 w-4 text-purple-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Streak Counter */}
          <div 
            title={`${streak} dias consecutivos de prática`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-medium"
          >
            <Flame className="h-3.5 w-3.5 fill-purple-500 text-purple-500" />
            <span className="font-mono font-bold">{streak}d</span>
          </div>

          {/* XP & Level Badge */}
          <div 
            title={`Nível ${userLevel} • ${userXp} Pontos de Experiência`}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium"
          >
            <Zap className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
            <span className="font-mono font-bold">{userXp} XP</span>
            <span className="text-purple-300/40 dark:text-purple-800">|</span>
            <span className="font-mono">Nv. {userLevel}</span>
          </div>

        </div>

      </div>

      {/* Mobile subnavigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-purple-200/70 dark:border-purple-950/60 bg-white dark:bg-[#0c0814] px-2 py-1.5 transition-colors">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'inicio' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Compass className="h-4 w-4 mb-0.5" />
          Início
        </button>
        <button
          onClick={() => setActiveTab('academia')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'academia' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="h-4 w-4 mb-0.5" />
          Academia
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'playground' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Terminal className="h-4 w-4 mb-0.5" />
          Playground
        </button>
        <button
          onClick={() => setActiveTab('conquistas')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'conquistas' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Trophy className="h-4 w-4 mb-0.5" />
          Conquistas
        </button>
        <button
          onClick={() => setActiveTab('sobre')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'sobre' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Info className="h-4 w-4 mb-0.5" />
          Sobre
        </button>
      </div>
    </header>
  );
};
