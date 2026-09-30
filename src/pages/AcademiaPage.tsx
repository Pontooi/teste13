import React, { useState, useEffect } from 'react';
import { useDualDev } from '../context/DualDevContext';
import { tracks } from '../data/tracks';
import { getLessonsByTrack } from '../data/lessons';
import { executeCode } from '../services/runners';
import { CodeEditor } from '../components/CodeEditor';
import { ConsoleOutput } from '../components/ConsoleOutput';
import { TheoryPanel } from '../components/TheoryPanel';
import { ExecutionResult, TestResult } from '../types';
import { LanguageIcon } from '../components/LanguageIcon';
import { 
  CheckCircle2, 
  Circle, 
  Menu, 
  X 
} from 'lucide-react';

export const AcademiaPage: React.FC = () => {
  const {
    currentTrackId,
    setCurrentTrackId,
    currentLessonId,
    setCurrentLessonId,
    currentLesson,
    completedLessonIds,
    codeDrafts,
    saveDraft,
    resetDraft,
    completeLesson,
    recordCodeExecution,
    nextLesson,
    prevLesson,
  } = useDualDev();

  const trackLessons = getLessonsByTrack(currentTrackId);
  const currentTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];

  const [editorCode, setEditorCode] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'tests'>('output');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (currentLesson) {
      const savedCode = codeDrafts[currentLesson.id];
      setEditorCode(savedCode !== undefined ? savedCode : currentLesson.initialCode);
      setExecutionResult(null);
      setTestResults([]);
      setActiveConsoleTab('output');
    }
  }, [currentLesson?.id]);

  const handleCodeChange = (newCode: string) => {
    setEditorCode(newCode);
    if (currentLesson) {
      saveDraft(currentLesson.id, newCode);
    }
  };

  const handleRunCode = async () => {
    if (!currentLesson) return;
    setIsRunning(true);
    setActiveConsoleTab('output');

    try {
      const res = await executeCode(currentTrackId, editorCode);
      setExecutionResult(res);
      recordCodeExecution(currentTrackId);
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Erro inesperado na execução.',
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTestChallenge = async () => {
    if (!currentLesson) return;
    setIsTesting(true);

    try {
      const execRes = await executeCode(currentTrackId, editorCode);
      setExecutionResult(execRes);
      recordCodeExecution(currentTrackId);

      const results: TestResult[] = currentLesson.testCases.map((tc) => {
        if (tc.validator) {
          const outcome = tc.validator(editorCode, execRes.stdout);
          return {
            testId: tc.id,
            description: tc.description,
            passed: outcome.passed,
            message: outcome.message,
          };
        }

        const passed = !execRes.stderr && execRes.stdout.trim().length > 0;
        return {
          testId: tc.id,
          description: tc.description,
          passed,
          message: passed ? 'Código executado com sucesso!' : 'Código falhou na execução.',
        };
      });

      setTestResults(results);
      setActiveConsoleTab('tests');

      const allPassed = results.length > 0 && results.every((r) => r.passed);
      if (allPassed) {
        completeLesson(currentLesson.id);
      }
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Erro na avaliação do código.',
        executionTimeMs: 0,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetCode = () => {
    if (!currentLesson) return;
    setEditorCode(currentLesson.initialCode);
    resetDraft(currentLesson.id);
    setExecutionResult(null);
    setTestResults([]);
  };

  const handleLoadSolution = () => {
    if (!currentLesson) return;
    setEditorCode(currentLesson.solutionCode);
    saveDraft(currentLesson.id, currentLesson.solutionCode);
  };

  const completedCount = trackLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = trackLessons.length > 0 ? Math.round((completedCount / trackLessons.length) * 100) : 0;

  const currentLessonIndex = trackLessons.findIndex((l) => l.id === currentLesson?.id);
  const hasNext = currentLessonIndex >= 0 && currentLessonIndex < trackLessons.length - 1;
  const hasPrev = currentLessonIndex > 0;
  const isCurrentCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] transition-colors">
      
      {/* Sub-bar for track selection and mobile drawer toggle */}
      <div className="border-b border-purple-200/80 dark:border-purple-950/70 bg-white/70 dark:bg-[#0e091c]/80 px-4 py-2.5 flex items-center justify-between backdrop-blur-sm transition-colors">
        
        {/* Track Pills (Purple Themed) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tracks.map((t) => {
            const isSelected = t.id === currentTrackId;
            return (
              <button
                key={t.id}
                onClick={() => setCurrentTrackId(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/25'
                    : 'bg-purple-50 dark:bg-[#150f28] text-slate-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-[#1e1538]'
                }`}
              >
                <LanguageIcon trackId={t.id} className="w-4 h-4" />
                <span>{t.name}</span>
                {isSelected && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 text-white">
                    {progressPercent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-xs font-medium text-purple-800 dark:text-purple-200"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span>Lições</span>
        </button>

      </div>

      {/* Main Learning Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Lesson Index Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white lg:bg-white/70 dark:bg-[#0c0816] lg:dark:bg-[#0c0816]/70 border-r border-purple-200/80 dark:border-purple-950/70 flex flex-col transition-transform duration-200 ease-in-out backdrop-blur-sm
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            top-16 lg:top-0 h-[calc(100vh-4rem)]
          `}
        >
          {/* Track Summary Header */}
          <div className="p-4 border-b border-purple-100 dark:border-purple-950/80">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <LanguageIcon trackId={currentTrack.id} className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 font-mono">
                  Trilha {currentTrack.name}
                </span>
              </div>
              <span className="text-xs text-slate-500 dark:text-purple-400/60 font-mono">
                {completedCount}/{trackLessons.length}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 w-full rounded-full bg-purple-100 dark:bg-purple-950/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {trackLessons.map((lesson) => {
              const isSelected = lesson.id === currentLesson?.id;
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setCurrentLessonId(lesson.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800/80 text-purple-900 dark:text-purple-200 font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-purple-300/70 hover:text-slate-900 dark:hover:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-purple-300 dark:text-purple-800 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="truncate font-medium">{lesson.title}</div>
                      <div className="text-[10px] text-slate-400 dark:text-purple-400/50 font-mono">{lesson.category}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-purple-500 dark:text-purple-400 shrink-0">
                    +{lesson.xp}XP
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom quick tip */}
          <div className="p-3 border-t border-purple-100 dark:border-purple-950/80 bg-purple-50/50 dark:bg-purple-950/20 text-[11px] text-slate-500 dark:text-purple-400/60">
            Dica: Complete os desafios para subir de nível e desbloquear insígnias.
          </div>
        </aside>

        {/* Workspace Panels (Theory + IDE + Console) */}
        <div className="flex-1 flex flex-col xl:flex-row gap-3 p-3 lg:p-4 overflow-y-auto">
          
          {/* Left: Theory & Challenge instructions */}
          <div className="w-full xl:w-[42%] h-[550px] xl:h-auto min-h-[480px]">
            {currentLesson ? (
              <TheoryPanel
                lesson={currentLesson}
                isCompleted={isCurrentCompleted}
                onNext={nextLesson}
                onPrev={prevLesson}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onLoadSolution={handleLoadSolution}
              />
            ) : (
              <div className="p-8 text-center text-slate-400 dark:text-purple-400/60">
                Selecione uma lição para iniciar.
              </div>
            )}
          </div>

          {/* Right: Code Editor & Console Output */}
          <div className="w-full xl:w-[58%] flex flex-col gap-3 min-h-[600px] xl:h-auto">
            {/* Top: Code Editor */}
            <div className="flex-1 min-h-[380px]">
              <CodeEditor
                code={editorCode}
                onChange={handleCodeChange}
                onRun={handleRunCode}
                onTest={handleTestChallenge}
                onReset={handleResetCode}
                trackId={currentTrackId}
                isRunning={isRunning}
                isTesting={isTesting}
              />
            </div>

            {/* Bottom: Console Terminal & Tests */}
            <div className="h-64 min-h-[220px]">
              <ConsoleOutput
                result={executionResult}
                testResults={testResults}
                onClear={() => {
                  setExecutionResult(null);
                  setTestResults([]);
                }}
                activeSubTab={activeConsoleTab}
                setActiveSubTab={setActiveConsoleTab}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
