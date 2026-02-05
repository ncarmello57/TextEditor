import * as monaco from 'monaco-editor';
import { ipcRenderer } from 'electron';
import * as path from 'path';

// Configure Monaco Editor loader
declare const __dirname: string;

// Monaco environment setup
(self as any).MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: string, label: string) {
    if (label === 'json') {
      return './monaco-editor/esm/vs/language/json/json.worker.js';
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return './monaco-editor/esm/vs/language/css/css.worker.js';
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return './monaco-editor/esm/vs/language/html/html.worker.js';
    }
    if (label === 'typescript' || label === 'javascript') {
      return './monaco-editor/esm/vs/language/typescript/ts.worker.js';
    }
    return './monaco-editor/esm/vs/editor/editor.worker.js';
  }
};

// State
let editor: monaco.editor.IStandaloneCodeEditor;
let currentFilePath: string | null = null;
let currentEncoding = 'utf-8';
let isDirty = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  setupEventListeners();
  setupIpcListeners();
});

function initEditor(): void {
  const container = document.getElementById('editor-container')!;

  editor = monaco.editor.create(container, {
    value: '',
    language: 'plaintext',
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', 'Courier New', monospace",
    minimap: { enabled: true },
    lineNumbers: 'on',
    wordWrap: 'off',
    scrollBeyondLastLine: false,
    renderWhitespace: 'selection',
    tabSize: 4,
    insertSpaces: true
  });

  // Track cursor position
  editor.onDidChangeCursorPosition((e) => {
    updatePosition(e.position.lineNumber, e.position.column);
  });

  // Track changes
  editor.onDidChangeModelContent(() => {
    if (!isDirty) {
      isDirty = true;
      updateTitle();
    }
  });
}

function setupEventListeners(): void {
  document.getElementById('btn-new')?.addEventListener('click', newFile);
  document.getElementById('btn-open')?.addEventListener('click', openFile);
  document.getElementById('btn-save')?.addEventListener('click', saveFile);
  document.getElementById('btn-save-as')?.addEventListener('click', saveFileAs);
}

function setupIpcListeners(): void {
  ipcRenderer.on('menu-new', () => newFile());
  ipcRenderer.on('menu-save', () => saveFile());
  ipcRenderer.on('menu-save-as', () => saveFileAs());

  ipcRenderer.on('file-opened', (_, data: { filePath: string; content: string; encoding: string; language: string }) => {
    loadFile(data);
  });
}

function newFile(): void {
  if (isDirty) {
    // TODO: Prompt to save
  }

  currentFilePath = null;
  currentEncoding = 'utf-8';
  isDirty = false;

  editor.setValue('');
  monaco.editor.setModelLanguage(editor.getModel()!, 'plaintext');

  updateTitle();
  updateStatus('New file created');
  updateEncoding('UTF-8');
  updateLanguage('Plain Text');
}

async function openFile(): Promise<void> {
  await ipcRenderer.invoke('open-file-dialog');
}

function loadFile(data: { filePath: string; content: string; encoding: string; language: string }): void {
  currentFilePath = data.filePath;
  currentEncoding = data.encoding;
  isDirty = false;

  editor.setValue(data.content);

  // Set language
  const model = editor.getModel();
  if (model) {
    monaco.editor.setModelLanguage(model, data.language);
  }

  updateTitle();
  updateStatus(`Opened: ${path.basename(data.filePath)}`);
  updateEncoding(data.encoding.toUpperCase());
  updateLanguage(getLanguageDisplayName(data.language));
}

async function saveFile(): Promise<void> {
  if (!currentFilePath) {
    await saveFileAs();
    return;
  }

  const content = editor.getValue();
  const result = await ipcRenderer.invoke('save-file', {
    filePath: currentFilePath,
    content,
    encoding: currentEncoding
  });

  if (result.success) {
    isDirty = false;
    updateTitle();
    updateStatus('File saved');
  } else {
    updateStatus(`Error: ${result.error}`);
  }
}

async function saveFileAs(): Promise<void> {
  const content = editor.getValue();
  const suggestedName = currentFilePath ? path.basename(currentFilePath) : 'untitled.txt';

  const result = await ipcRenderer.invoke('save-file-dialog', {
    content,
    encoding: currentEncoding,
    suggestedName
  });

  if (result.success) {
    currentFilePath = result.filePath;
    isDirty = false;
    updateTitle();
    updateStatus('File saved');
  } else if (!result.canceled) {
    updateStatus(`Error: ${result.error}`);
  }
}

function updateTitle(): void {
  const fileName = currentFilePath ? path.basename(currentFilePath) : 'Untitled';
  document.title = `${isDirty ? '* ' : ''}${fileName} - Text Editor`;
}

function updateStatus(text: string): void {
  const el = document.getElementById('status-text');
  if (el) el.textContent = text;
}

function updatePosition(line: number, column: number): void {
  const el = document.getElementById('status-position');
  if (el) el.textContent = `Ln ${line}, Col ${column}`;
}

function updateEncoding(encoding: string): void {
  const el = document.getElementById('status-encoding');
  if (el) el.textContent = encoding;
}

function updateLanguage(language: string): void {
  const el = document.getElementById('status-language');
  if (el) el.textContent = language;
}

function getLanguageDisplayName(lang: string): string {
  const names: { [key: string]: string } = {
    'plaintext': 'Plain Text',
    'html': 'HTML',
    'xml': 'XML',
    'json': 'JSON',
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'csharp': 'C#',
    'css': 'CSS',
    'scss': 'SCSS',
    'less': 'Less',
    'java': 'Java',
    'sql': 'SQL',
    'c': 'C',
    'cpp': 'C++',
    'python': 'Python',
    'markdown': 'Markdown',
    'yaml': 'YAML'
  };
  return names[lang] || lang;
}
