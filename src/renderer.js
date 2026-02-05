const { ipcRenderer } = require('electron');
const path = require('path');
const monaco = require('monaco-editor');

// Monaco environment setup for workers
self.MonacoEnvironment = {
  getWorker: function (workerId, label) {
    const getWorkerModule = (moduleUrl, label) => {
      return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl, label), {
        name: label,
        type: 'module'
      });
    };
    switch (label) {
      case 'json':
        return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
      case 'css':
      case 'scss':
      case 'less':
        return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
      case 'html':
      case 'handlebars':
      case 'razor':
        return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
      case 'typescript':
      case 'javascript':
        return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
      default:
        return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
    }
  }
};

// State
let editor = null;
let currentFilePath = null;
let currentEncoding = 'utf-8';
let isDirty = false;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initEditor();
  setupEventListeners();
  setupIpcListeners();
});

function initEditor() {
  const container = document.getElementById('editor-container');

  editor = monaco.editor.create(container, {
    value: '',
    language: 'plaintext',
    theme: 'vs-dark',
    automaticLayout: true,
    fontSize: 14,
    fontFamily: "'Cascadia Code', 'Fira Code', Consolas, 'Courier New', monospace",
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

function setupEventListeners() {
  document.getElementById('btn-new').addEventListener('click', newFile);
  document.getElementById('btn-open').addEventListener('click', openFile);
  document.getElementById('btn-save').addEventListener('click', saveFile);
  document.getElementById('btn-save-as').addEventListener('click', saveFileAs);
}

function setupIpcListeners() {
  ipcRenderer.on('menu-new', () => newFile());
  ipcRenderer.on('menu-save', () => saveFile());
  ipcRenderer.on('menu-save-as', () => saveFileAs());

  ipcRenderer.on('file-opened', (_, data) => {
    loadFile(data);
  });
}

function newFile() {
  currentFilePath = null;
  currentEncoding = 'utf-8';
  isDirty = false;

  editor.setValue('');
  monaco.editor.setModelLanguage(editor.getModel(), 'plaintext');

  updateTitle();
  updateStatus('New file created');
  updateEncoding('UTF-8');
  updateLanguage('Plain Text');
}

async function openFile() {
  await ipcRenderer.invoke('open-file-dialog');
}

function loadFile(data) {
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
  updateStatus('Opened: ' + path.basename(data.filePath));
  updateEncoding(data.encoding.toUpperCase());
  updateLanguage(getLanguageDisplayName(data.language));
}

async function saveFile() {
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
    updateStatus('Error: ' + result.error);
  }
}

async function saveFileAs() {
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
    updateStatus('Error: ' + result.error);
  }
}

function updateTitle() {
  const fileName = currentFilePath ? path.basename(currentFilePath) : 'Untitled';
  document.title = (isDirty ? '* ' : '') + fileName + ' - Text Editor';
}

function updateStatus(text) {
  const el = document.getElementById('status-text');
  if (el) el.textContent = text;
}

function updatePosition(line, column) {
  const el = document.getElementById('status-position');
  if (el) el.textContent = 'Ln ' + line + ', Col ' + column;
}

function updateEncoding(encoding) {
  const el = document.getElementById('status-encoding');
  if (el) el.textContent = encoding;
}

function updateLanguage(language) {
  const el = document.getElementById('status-language');
  if (el) el.textContent = language;
}

function getLanguageDisplayName(lang) {
  const names = {
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
