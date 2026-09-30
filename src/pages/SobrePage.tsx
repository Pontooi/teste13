import React, { useState } from 'react';
import { 
  Code2, 
  Cpu, 
  CheckCircle2, 
  Keyboard,
  Zap,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { TrackId } from '../types';
import { getSnippetsByTrack } from '../data/snippets';
import { LanguageIcon } from '../components/LanguageIcon';
import { tracks } from '../data/tracks';

export const SobrePage: React.FC = () => {
  const [selectedSnippetTrack, setSelectedSnippetTrack] = useState<TrackId>('java');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentSnippets = getSnippetsByTrack(selectedSnippetTrack);

  const handleCopySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Intro Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/25 mb-2">
          <Code2 className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Sobre o DualDev & Atalhos
        </h1>
        <p className="text-slate-600 dark:text-purple-200/80 text-sm max-w-xl mx-auto">
          Uma plataforma de ensino interativo voltada para estudantes e desenvolvedores que buscam dominar lógica de programação, sintaxe moderna e arquitetura de software na prática.
        </p>
      </div>

      {/* NEW: VS Code Snippets & Autocomplete Section */}
      <div className="rounded-2xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#130d22] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 dark:border-purple-950/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-base">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Snippets Inteligentes e Autocompletar (Estilo VS Code)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-purple-300/70 leading-relaxed max-w-2xl">
              Assim como nas extensões do Visual Studio Code, basta digitar as iniciais do comando (ex: <code className="text-purple-700 dark:text-purple-300 font-mono font-bold bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded">sout</code> ou <code className="text-purple-700 dark:text-purple-300 font-mono font-bold bg-purple-100 dark:bg-purple-950 px-1.5 py-0.5 rounded">main</code>) no editor e pressionar <kbd className="font-mono font-bold px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">Tab</kbd> ou <kbd className="font-mono font-bold px-1.5 py-0.5 rounded bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200">Enter</kbd> para completar o bloco de código instantaneamente.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 border border-purple-300 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-mono font-medium self-start sm:self-auto">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>IntelliSense Ativo</span>
          </div>
        </div>

        {/* Track selector tabs for snippets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-purple-100 dark:border-purple-950/80">
          <span className="text-xs font-mono text-slate-500 dark:text-purple-400/60 pr-2">Linguagem:</span>
          {tracks.map((t) => {
            const isSelected = t.id === selectedSnippetTrack;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedSnippetTrack(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                    : 'bg-purple-50/70 dark:bg-[#0a0714] text-slate-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/80 border border-purple-200/60 dark:border-purple-900/50'
                }`}
              >
                <LanguageIcon trackId={t.id} className="w-3.5 h-3.5" />
                <span>{t.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-purple-700 text-purple-100' : 'bg-purple-200/60 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'}`}>
                  {getSnippetsByTrack(t.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {currentSnippets.map((snippet) => {
            const isCopied = copiedId === snippet.id;

            return (
              <div
                key={snippet.id}
                className="group relative rounded-xl border border-purple-100 dark:border-purple-950/80 bg-purple-50/40 dark:bg-[#0d081c] hover:border-purple-300 dark:hover:border-purple-700 p-4 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-600 text-white font-mono font-extrabold text-xs shadow-xs">
                      {snippet.prefix}
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-purple-400/70 font-medium">
                      + Tab
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopySnippet(snippet.id, snippet.body)}
                    title="Copiar código gerado"
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-200"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity">Copiar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                  {snippet.description}
                </div>

                <div className="rounded-lg bg-white dark:bg-[#07040e] border border-purple-100 dark:border-purple-950/90 p-2.5 overflow-x-auto">
                  <pre className="font-mono text-[11px] text-purple-700 dark:text-purple-300 leading-relaxed">
                    {snippet.body}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Shortcuts Summary */}
      <div className="rounded-2xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#130d22] p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <Keyboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span>Atalhos de Teclado no Editor</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-[#0a0714] border border-purple-100 dark:border-purple-950/80 font-mono">
            <span className="text-slate-600 dark:text-purple-300/70">Executar Código</span>
            <kbd className="px-2 py-1 rounded bg-white dark:bg-[#19102c] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] font-bold">
              Ctrl + Enter
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-[#0a0714] border border-purple-100 dark:border-purple-950/80 font-mono">
            <span className="text-slate-600 dark:text-purple-300/70">Autocompletar Snippet</span>
            <kbd className="px-2 py-1 rounded bg-white dark:bg-[#19102c] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] font-bold">
              Tab / Enter
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-[#0a0714] border border-purple-100 dark:border-purple-950/80 font-mono">
            <span className="text-slate-600 dark:text-purple-300/70">Abrir Sugestões</span>
            <kbd className="px-2 py-1 rounded bg-white dark:bg-[#19102c] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] font-bold">
              Ctrl + Espaço
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-[#0a0714] border border-purple-100 dark:border-purple-950/80 font-mono">
            <span className="text-slate-600 dark:text-purple-300/70">Navegar Sugestões</span>
            <kbd className="px-2 py-1 rounded bg-white dark:bg-[#19102c] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] font-bold">
              Seta Cima / Baixo
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-[#0a0714] border border-purple-100 dark:border-purple-950/80 font-mono">
            <span className="text-slate-600 dark:text-purple-300/70">Fechar Menu Popover</span>
            <kbd className="px-2 py-1 rounded bg-white dark:bg-[#19102c] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] font-bold">
              Esc
            </kbd>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 dark:bg-[#0a0714] border border-purple-100 dark:border-purple-950/80 font-mono">
            <span className="text-slate-600 dark:text-purple-300/70">Indentar 4 Espaços</span>
            <kbd className="px-2 py-1 rounded bg-white dark:bg-[#19102c] text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-[11px] font-bold">
              Tab (sem sugestão)
            </kbd>
          </div>
        </div>
      </div>

      {/* Highlights & Execution Architecture */}
      <div className="rounded-2xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#130d22] p-6 space-y-6 shadow-sm">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-bold text-sm">
          <Cpu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span>Motor de Execução Multi-Linguagem no Navegador</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-purple-200/80 leading-relaxed">
          O DualDev conta com interpretadores modernos integrados que analisam e executam o código diretamente no navegador com feedback instantâneo:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-purple-100 dark:border-purple-950/80 bg-purple-50/40 dark:bg-[#0a0714] p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Simulador Java Completo</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-purple-300/70 leading-relaxed">
              Mapeamento de <code className="text-purple-700 dark:text-purple-300 font-mono">public class</code>, método principal <code className="text-purple-700 dark:text-purple-300 font-mono">main</code>, métodos estáticos com parâmetros, arrays e captura de <code className="text-purple-700 dark:text-purple-300 font-mono">System.out.println</code>.
            </p>
          </div>

          <div className="rounded-xl border border-purple-100 dark:border-purple-950/80 bg-purple-50/40 dark:bg-[#0a0714] p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Python Transpiler & Built-ins</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-purple-300/70 leading-relaxed">
              Suporte a loops <code className="text-purple-700 dark:text-purple-300 font-mono">for in</code>, <code className="text-purple-700 dark:text-purple-300 font-mono">range()</code>, funções <code className="text-purple-700 dark:text-purple-300 font-mono">def/return</code>, listas e utilitários <code className="text-purple-700 dark:text-purple-300 font-mono">len, max, min, sum</code>.
            </p>
          </div>

          <div className="rounded-xl border border-purple-100 dark:border-purple-950/80 bg-purple-50/40 dark:bg-[#0a0714] p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>JavaScript ES6+ Seguro</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-purple-300/70 leading-relaxed">
              Console isolado, suporte a arrow functions, métodos funcionais de array (<code className="text-purple-700 dark:text-purple-300 font-mono">map, filter</code>) e desestruturação de objetos com medição de latência em milissegundos.
            </p>
          </div>

          <div className="rounded-xl border border-purple-100 dark:border-purple-950/80 bg-purple-50/40 dark:bg-[#0a0714] p-4 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>HTML5 & CSS3 Semânticos</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-purple-300/70 leading-relaxed">
              Validação de tags estruturais, formulários acessíveis, Flexbox e Grid com analisador de integridade de código em tempo real.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
