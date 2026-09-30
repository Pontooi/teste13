import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  Copy, 
  Check, 
  FileCode, 
  Loader2,
  Zap,
  Sparkles,
  X
} from 'lucide-react';
import { TrackId } from '../types';
import { getSnippetsByTrack, CodeSnippet } from '../data/snippets';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  onRun: () => void;
  onTest?: () => void;
  onReset: () => void;
  trackId: TrackId;
  isRunning: boolean;
  isTesting?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onTest,
  onReset,
  trackId,
  isRunning,
  isTesting = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [showSnippetsMenu, setShowSnippetsMenu] = useState(false);
  
  // Autocomplete state (VS Code IntelliSense popup)
  const [suggestions, setSuggestions] = useState<CodeSnippet[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [wordPrefix, setWordPrefix] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const availableSnippets = getSnippetsByTrack(trackId);

  const getFileName = (track: TrackId) => {
    switch (track) {
      case 'java':
        return 'Main.java';
      case 'python':
        return 'main.py';
      case 'javascript':
        return 'app.js';
      case 'html':
        return 'index.html';
      case 'css':
        return 'styles.css';
      default:
        return 'code.txt';
    }
  };

  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 12);

  // Check prefix when cursor moves or text changes
  const updateSuggestions = (text: string, cursorPos: number) => {
    const textBeforeCursor = text.substring(0, cursorPos);
    const match = textBeforeCursor.match(/([a-zA-Z0-9_]+)$/);
    const currentWord = match ? match[1] : '';

    if (currentWord.length >= 1) {
      const filtered = availableSnippets.filter((s) =>
        s.prefix.toLowerCase().startsWith(currentWord.toLowerCase())
      );

      if (filtered.length > 0) {
        setSuggestions(filtered);
        setWordPrefix(currentWord);
        setSelectedIndex(0);
        setShowSuggestions(true);
        return;
      }
    }

    setShowSuggestions(false);
    setSuggestions([]);
    setWordPrefix('');
  };

  const insertSnippet = (snippet: CodeSnippet) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursor = textarea.selectionStart;
    const prefixLen = wordPrefix.length;
    const startPos = cursor - prefixLen;
    const endPos = textarea.selectionEnd;

    const newCode = code.substring(0, startPos) + snippet.body + code.substring(endPos);
    onChange(newCode);

    setShowSuggestions(false);
    setShowSnippetsMenu(false);

    requestAnimationFrame(() => {
      const newCursor = startPos + snippet.body.length;
      textarea.selectionStart = textarea.selectionEnd = newCursor;
      textarea.focus();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run Code: Ctrl + Enter / Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Force Open IntelliSense: Ctrl + Space
    if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
      e.preventDefault();
      setSuggestions(availableSnippets);
      setSelectedIndex(0);
      setWordPrefix('');
      setShowSuggestions(true);
      return;
    }

    // When suggestions popover is active
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        insertSnippet(suggestions[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSuggestions(false);
        return;
      }
    }

    // Standard Tab: Insert 4 spaces if suggestions aren't open
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = '    ';

      const newCode = code.substring(0, start) + spaces + code.substring(end);
      onChange(newCode);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      });
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);
    updateSuggestions(val, e.target.selectionStart);
  };

  const handleSelectionChange = () => {
    if (textareaRef.current) {
      updateSuggestions(code, textareaRef.current.selectionStart);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative flex flex-col h-full rounded-xl border border-purple-200/80 dark:border-purple-950/70 bg-white dark:bg-[#120c22] shadow-xl overflow-hidden transition-colors">
      
      {/* Editor Top Bar */}
      <div className="flex items-center justify-between border-b border-purple-200/80 dark:border-purple-950/70 bg-slate-50 dark:bg-[#0f0a1c] px-4 py-2.5 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-purple-50 dark:bg-[#1a112e] border border-purple-200 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 text-xs font-mono font-medium">
            <FileCode className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>{getFileName(trackId)}</span>
          </div>

          {/* Snippets / Autocomplete quick trigger button */}
          <button
            onClick={() => setShowSnippetsMenu(!showSnippetsMenu)}
            title="Abrir catálogo de snippets (Atalhos com Tab)"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-purple-100/70 dark:bg-purple-950/70 hover:bg-purple-200/70 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800/60 transition-all"
          >
            <Zap className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>Snippets (Tab)</span>
          </button>

          <span className="text-[11px] text-slate-500 dark:text-purple-400/60 font-mono hidden md:inline">
            Ctrl + Enter para rodar • Tab para autocompletar
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            title="Copiar código"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-200 hover:bg-purple-100/60 dark:hover:bg-purple-950/50 rounded transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copiado!' : 'Copiar'}</span>
          </button>

          <button
            onClick={onReset}
            title="Restaurar código inicial da lição"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-600 dark:text-slate-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-950/50 rounded transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>

          {/* Test / Verify Challenge button */}
          {onTest && (
            <button
              onClick={onTest}
              disabled={isRunning || isTesting}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 transition-all disabled:opacity-50"
            >
              {isTesting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              <span>Verificar Desafio</span>
            </button>
          )}

          {/* Run Code Button */}
          <button
            onClick={onRun}
            disabled={isRunning || isTesting}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isRunning ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-white" />
            )}
            <span>Executar</span>
          </button>
        </div>
      </div>

      {/* Editor Core Body with Line Numbers & IntelliSense Popover */}
      <div className="relative flex flex-1 overflow-hidden font-mono text-sm leading-relaxed bg-white dark:bg-[#0e091a]">
        
        {/* Line Numbers column */}
        <div className="select-none py-3 px-3 text-right text-xs text-purple-400/60 dark:text-purple-600/60 bg-purple-50/40 dark:bg-[#0a0614] border-r border-purple-100 dark:border-purple-950/70 font-mono min-w-[3rem]">
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="leading-6">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onClick={handleSelectionChange}
          onKeyUp={handleSelectionChange}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="// Digite seu código aqui... Use atalhos como 'sout', 'main', 'def', 'clg' e aperte Tab!"
          className="flex-1 w-full h-full resize-none bg-transparent p-3 text-slate-800 dark:text-purple-100 outline-none font-mono text-sm leading-6 selection:bg-purple-500/30 focus:ring-0 border-0 whitespace-pre overflow-x-auto"
          style={{ tabSize: 4 }}
        />

        {/* Floating VS Code IntelliSense Snippet Popover */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-16 bottom-10 z-30 w-80 max-w-[90%] rounded-xl border border-purple-300 dark:border-purple-700 bg-white dark:bg-[#180f2d] shadow-2xl p-1.5 transition-all animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-purple-100 dark:border-purple-900/60 text-[10px] font-mono text-purple-600 dark:text-purple-300 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-purple-500" />
                Sugestões IntelliSense
              </span>
              <span className="text-slate-400 dark:text-purple-400/50">Tab ou Enter</span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {suggestions.map((snippet, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={snippet.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertSnippet(snippet);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-mono transition-colors ${
                      isSelected
                        ? 'bg-purple-600 text-white font-bold shadow-sm'
                        : 'text-slate-700 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-950/60'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-purple-700 text-white' : 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'}`}>
                        {snippet.prefix}
                      </span>
                      <span className="truncate">{snippet.description}</span>
                    </div>
                    <span className="text-[10px] opacity-75 font-sans ml-2">Tab</span>
                  </div>
                );
              })}
            </div>
            
            <div className="px-2 pt-1.5 border-t border-purple-100 dark:border-purple-900/60 text-[10px] text-slate-400 dark:text-purple-400/60 flex items-center justify-between">
              <span>↑/↓ navegar</span>
              <span>Esc para fechar</span>
            </div>
          </div>
        )}

      </div>

      {/* Snippets Palette Modal / Flyout when clicking "Snippets (Tab)" button */}
      {showSnippetsMenu && (
        <div className="absolute inset-0 z-40 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-[#150d28] shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-purple-900/60 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Snippets & Autocompletar ({trackId.toUpperCase()})
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-purple-300/70">
                    Digite o prefixo e aperte <kbd className="px-1 py-0.5 rounded bg-purple-100 dark:bg-purple-950 border border-purple-300 dark:border-purple-800 font-mono font-bold text-purple-700 dark:text-purple-300">Tab</kbd> no editor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSnippetsMenu(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-purple-950/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {availableSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  onClick={() => insertSnippet(snippet)}
                  className="group flex items-center justify-between p-2.5 rounded-xl border border-purple-100 dark:border-purple-950/80 bg-purple-50/50 dark:bg-[#0d071a] hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-100/60 dark:hover:bg-[#1a1033] cursor-pointer transition-all"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-purple-600 text-white font-mono font-bold text-xs shadow-xs">
                        {snippet.prefix}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-purple-200">
                        {snippet.label}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-purple-400/70">
                      {snippet.description}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 group-hover:underline">
                    Inserir →
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-purple-100 dark:border-purple-900/60 text-center text-xs text-slate-500 dark:text-purple-300/60">
              Dica: Você também pode apertar <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-purple-950 font-mono text-purple-600 dark:text-purple-400 font-bold">Ctrl + Espaço</kbd> para abrir sugestões.
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar Info */}
      <div className="flex items-center justify-between border-t border-purple-200/80 dark:border-purple-950/70 bg-slate-50 dark:bg-[#0a0614] px-4 py-1.5 text-[11px] text-slate-500 dark:text-purple-300/50 font-mono transition-colors">
        <div className="flex items-center gap-3">
          <span>{lines.length} linhas</span>
          <span>{code.length} caracteres</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Tab: Autocompletar
          </span>
          <span>•</span>
          <span>UTF-8 • {trackId.toUpperCase()}</span>
        </div>
      </div>

    </div>
  );
};
