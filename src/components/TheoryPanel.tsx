import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  CheckCircle, 
  Zap, 
  Clock, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { Lesson } from '../types';

interface TheoryPanelProps {
  lesson: Lesson;
  isCompleted: boolean;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onLoadSolution: () => void;
}

export const TheoryPanel: React.FC<TheoryPanelProps> = ({
  lesson,
  isCompleted,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onLoadSolution,
}) => {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="flex flex-col h-full rounded-xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#120c22] shadow-xl overflow-hidden transition-colors">
      
      {/* Theory Header */}
      <div className="border-b border-purple-200/80 dark:border-purple-950/70 bg-slate-50 dark:bg-[#0f0a1c] px-5 py-3 transition-colors">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 border border-purple-300/70 dark:border-purple-800/60">
              {lesson.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-purple-300/70">
              {lesson.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-bold">
              <Zap className="h-3.5 w-3.5 fill-purple-600 dark:fill-purple-400" />
              <span>+{lesson.xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-purple-300/60">
              <Clock className="h-3.5 w-3.5" />
              <span>~{lesson.estimatedMinutes} min</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {lesson.title}
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs text-emerald-500 font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle className="h-3 w-3" />
                Concluído
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Scrollable Theory Body */}
      <div className="flex-1 overflow-y-auto p-5 text-slate-700 dark:text-purple-100 text-sm leading-relaxed space-y-5">
        
        {/* Render formatted markdown content */}
        <div className="max-w-none text-sm space-y-4">
          {lesson.theory.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-base font-bold text-slate-900 dark:text-white tracking-tight pt-2 border-b border-purple-100 dark:border-purple-950/80 pb-1">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={idx} className="text-sm font-semibold text-purple-700 dark:text-purple-300 pt-2">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('```')) {
              const cleaned = paragraph.replace(/```[a-z]*\n?/g, '');
              return (
                <div key={idx} className="rounded-lg bg-[#0e091a] border border-purple-900/40 p-3 font-mono text-xs overflow-x-auto text-purple-200 shadow-inner">
                  <pre>{cleaned}</pre>
                </div>
              );
            }
            return (
              <p key={idx} className="text-slate-700 dark:text-purple-200/90 whitespace-pre-line leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Challenge Box (Purple Glow) */}
        <div className="rounded-xl border border-purple-300 dark:border-purple-700/50 bg-purple-500/5 dark:bg-purple-950/30 p-4 space-y-2">
          <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <span>Objetivo do Exercício</span>
          </div>
          <p className="text-slate-800 dark:text-purple-100 text-sm leading-relaxed font-medium">
            {lesson.instructions}
          </p>
        </div>

        {/* Hints Accordion */}
        {lesson.hints && lesson.hints.length > 0 && (
          <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-slate-50 dark:bg-[#0f0a1c] overflow-hidden transition-colors">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full flex items-center justify-between p-3.5 text-xs font-semibold text-slate-700 dark:text-purple-200 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100/40 dark:hover:bg-purple-950/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span>Precisa de uma dica? ({lesson.hints.length} disponíveis)</span>
              </div>
              {showHints ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showHints && (
              <div className="p-3.5 pt-0 border-t border-purple-200/60 dark:border-purple-900/40 space-y-2 text-xs text-slate-700 dark:text-purple-200">
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  {lesson.hints.map((hint, i) => (
                    <li key={i} className="leading-relaxed">
                      {hint}
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <button
                    onClick={onLoadSolution}
                    className="text-[11px] font-mono text-purple-600 dark:text-purple-400 hover:underline transition-colors"
                  >
                    Ver código da solução sugerida
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between border-t border-purple-200/80 dark:border-purple-950/70 bg-slate-50 dark:bg-[#0f0a1c] px-5 py-3 transition-colors">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Anterior
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <span>Próxima Lição</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

    </div>
  );
};
