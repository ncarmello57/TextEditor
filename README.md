# Text Editor

A lightweight, cross-platform text editor built with Electron and CodeMirror 5.

## Features

### File Management
- Create, open, save, and save-as files
- Multiple open files with a tabbed side panel
- Recent files list (up to 10) accessible from the File menu
- Reload file from disk with unsaved changes warning
- Drag and drop to open files
- OS file associations for common file types
- Unsaved changes warnings on close

### Editing
- Undo/redo (10-level history)
- Auto-close brackets and tags
- Bracket matching
- Word wrap toggle
- Document formatting for JSON, XML, and HTML
- Persistent format type mappings for custom file extensions

### Search and Replace
- Find with match highlighting and navigation
- Replace one or replace all
- Case-sensitive and regex toggle options
- Keyboard shortcuts: `Cmd/Ctrl+F` (find), `Cmd/Ctrl+H` (replace)

### File Merge
- Side-by-side diff view with LCS-based line comparison
- Bidirectional change pushing between left and right panels
- Per-panel save buttons for independent file saving
- Refresh diff after manual edits
- Synchronized scrolling between panels
- Cancel merge with unsaved changes warning

### Syntax Highlighting
Supported languages: JavaScript, TypeScript, HTML, XML, CSS, SCSS, Less, JSON, C#, Java, C/C++, Python, SQL, Markdown, YAML

### Themes
- Dark (default)
- Light
- Monokai
- Dracula
- Solarized Light

Theme selection persists across sessions.

### Encoding
- Automatic encoding detection (UTF-8, UTF-16 LE/BE) via BOM and validation
- Encoding-aware file reading and writing using iconv-lite

### Icon Toolbar
Compact icon-based toolbar with hover tooltips for all actions: New, Open, Save, Save As, Reload, Undo, Redo, Format, Word Wrap, Search, Merge, Theme, and Close.

## Getting Started

### Prerequisites
- Node.js
- npm

### Install
```bash
npm install
```

### Run
```bash
npm start
```

### Build Distributables
```bash
# Windows portable executable
npm run pack:win

# macOS app bundle
npm run dist:mac
```

## Tech Stack
- **Electron** - Desktop application framework
- **CodeMirror 5** - Code editor component
- **TypeScript** - Main process
- **iconv-lite** - Character encoding support

## License
MIT
