import React from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  AlertCircle
} from 'lucide-react';
import { ExecutionResult, TestResult } from '../types';

interface ConsoleOutputProps {
  result: ExecutionResult | null;
  testResults: TestResult[];
  onClear: () => void;
  activeSubTab: 'output' | 'tests';
  setActiveSubTab: (tab: 'output' | 'tests') => void;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  result,
  testResults,
  onClear,
  activeSubTab,
  setActiveSubTab,
}) => {
  const hasTests = testResults.length > 0;
  const passedTestsCount = testResults.filter((t) => t.passed).length;
  const allTestsPassed = hasTests && passedTestsCount === testResults.length;

  return (
    <div className="flex flex-col h-full rounded-xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#120c22] shadow-xl overflow-hidden transition-colors">
      
      {/* Console Tab Header */}
      <div className="flex items-center justify-between border-b border-purple-200/80 dark:border-purple-950/70 bg-slate-50 dark:bg-[#0f0a1c] px-4 py-2 transition-colors">
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setActiveSubTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeSubTab === 'output'
                ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-purple-200'
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Terminal</span>
          </button>

          {hasTests && (
            <button
              onClick={() => setActiveSubTab('tests')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                activeSubTab === 'tests'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-purple-200'
              }`}
            >
              {allTestsPassed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <AlertCircle className="h-3.5 w-3.5 text-purple-500" />
              )}
              <span>Testes ({passedTestsCount}/{testResults.length})</span>
            </button>
          )}

        </div>

        {/* Clear and Status */}
        <div className="flex items-center gap-3">
          {result && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-purple-500/70 dark:text-purple-400/60">
              <Clock className="h-3 w-3" />
              <span>{result.executionTimeMs}ms</span>
            </div>
          )}

          <button
            onClick={onClear}
            title="Limpar console"
            className="text-slate-500 hover:text-slate-800 dark:text-purple-400/60 dark:hover:text-purple-200 p-1 rounded hover:bg-purple-100/50 dark:hover:bg-purple-950/60 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Output Content (High Contrast Terminal Dark Surface) */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed bg-[#0a0714] text-purple-100">
        {activeSubTab === 'output' && (
          <div>
            {!result ? (
              <div className="flex flex-col items-center justify-center h-48 text-purple-400/40 text-center">
                <Terminal className="h-8 w-8 mb-2 stroke-1 opacity-40" />
                <p>Nenhuma saída gerada ainda.</p>
                <p className="text-[11px] text-purple-400/30 mt-1">
                  Clique em "Executar" para compilar e rodar o código.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {result.stdout && (
                  <pre className="text-emerald-400 whitespace-pre-wrap selection:bg-emerald-950/80">
                    {result.stdout}
                  </pre>
                )}

                {result.stderr && (
                  <div className="rounded-lg border border-red-500/30 bg-red-950/40 p-3 text-red-300">
                    <div className="flex items-center gap-2 font-bold mb-1 text-red-400">
                      <XCircle className="h-4 w-4" />
                      <span>Erro de Execução</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {!result.stdout && !result.stderr && (
                  <p className="text-purple-400/40 italic">
                    Programa finalizou com código 0 (sem saída de texto).
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'tests' && (
          <div className="space-y-3">
            {allTestsPassed && (
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-emerald-200">Parabéns! Todos os testes foram aprovados!</div>
                  <div className="text-[11px] text-emerald-400/80">
                    Você dominou este conceito e garantiu seus pontos de experiência (XP).
                  </div>
                </div>
              </div>
            )}

            {testResults.map((t, idx) => (
              <div
                key={t.testId || idx}
                className={`p-3 rounded-lg border transition-all ${
                  t.passed
                    ? 'bg-[#120e20] border-emerald-500/30 text-purple-100'
                    : 'bg-[#120e20] border-red-500/30 text-purple-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    {t.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                    )}
                    <span>{t.description}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      t.passed
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {t.passed ? 'PASSOU' : 'FALHOU'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-300/60 pl-6">{t.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
