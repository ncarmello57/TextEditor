# EGIEdit

A lightweight, fast text and code editor built with Electron and CodeMirror.

## Features

### File Management
- **New / Open / Save / Save As** — standard file operations via toolbar or keyboard shortcuts
- **Reload from disk** — discard unsaved changes and reload the current file
- **Multiple open files** — switch between files using the file panel; unsaved changes are tracked per file
- **Recent files** — quickly reopen the last 10 files from the File menu; list can be cleared at any time
- **File associations** — registered as the default editor for all supported file types; double-clicking a file in Finder or Explorer opens it directly in EGIEdit
- **Single-instance** — only one instance of the app ever runs; opening a file externally while the app is already running brings the existing window to the front and opens the file there rather than launching a second window
- **Unsaved changes warning** — prompted to save, discard, or cancel before closing a dirty file

### Encoding
- Automatic encoding detection on open (UTF-8, UTF-16 BE, UTF-16 LE, BOM-aware)
- Files are written back in their detected encoding, preserving the original byte-order marks

### Editing
- **Line numbers**
- **Word wrap** — toggle via toolbar button; state is remembered across sessions
- **Undo / Redo** (toolbar + `Cmd/Ctrl+Z` / `Cmd/Ctrl+Y`)
- **Auto-close brackets and tags**
- **Bracket matching**
- **Document formatting** — pretty-print JSON, XML, and HTML; per-extension format preferences are remembered so the same file type is always formatted the same way

### Find & Replace
- Plain text and regular expression search
- Case-sensitive toggle
- Navigate matches forward and backward
- Replace current match or replace all
- Works in both the main editor and the merge view

### Special Characters
Toggle visibility of invisible characters via the `¶` toolbar button (state is remembered across sessions):
- Spaces shown as `·`
- Tabs shown as `→`
- Line endings shown as `¶` at the end of each line

### Syntax Highlighting
Full syntax highlighting for the following languages via CodeMirror:

| Language | Extensions |
|---|---|
| Plain Text | `.txt` |
| Markdown | `.md`, `.markdown` |
| HTML | `.html`, `.htm` |
| XML | `.xml`, `.xaml` |
| JSON | `.json` |
| JavaScript | `.js`, `.jsx`, `.mjs` |
| TypeScript | `.ts`, `.tsx` |
| C# | `.cs` |
| CSS | `.css`, `.scss`, `.less` |
| Java | `.java` |
| SQL | `.sql` |
| C / C++ | `.c`, `.cpp`, `.h`, `.hpp` |
| Python | `.py` |
| YAML | `.yaml`, `.yml` |

### Themes
Select from the theme dropdown in the toolbar (preference is remembered across sessions):

| Theme | Style |
|---|---|
| Dark | Material Darker (default) |
| Light | CodeMirror default light |
| Monokai | Classic Monokai |
| Dracula | Dracula dark |
| Solarized Light | Solarized light |

### Font & Weight
Select a font family and weight from the two dropdowns in the toolbar (preferences are remembered across sessions):

**Fonts:**
- Cascadia Code (default)
- Fira Code
- JetBrains Mono
- Consolas
- Menlo
- Courier New

**Weights:** 300 – Light, 400 – Regular (default), 500 – Medium, 600 – SemiBold, 700 – Bold

### File Merge / Diff
Click the `↔` toolbar button to open the merge view:
- Side-by-side editor panes with LCS-based line diff
- Added / removed / changed lines are colour-coded
- Bidirectional change pushing (push to left / push to right)
- Both panes are fully editable; refresh the diff after manual edits
- Each pane can be saved independently
- Synchronised scrolling between panes
- Done button applies the left pane content back to the active file

## Keyboard Shortcuts

| Action | macOS | Windows / Linux |
|---|---|---|
| New file | `Cmd+N` | `Ctrl+N` |
| Open file | `Cmd+O` | `Ctrl+O` |
| Save | `Cmd+S` | `Ctrl+S` |
| Save As | `Cmd+Shift+S` | `Ctrl+Shift+S` |
| Undo | `Cmd+Z` | `Ctrl+Z` |
| Redo | `Cmd+Shift+Z` | `Ctrl+Y` |
| Find & Replace | `Cmd+F` | `Ctrl+F` |
| Find next | `Enter` (in search bar) | `Enter` |
| Find previous | `Shift+Enter` | `Shift+Enter` |
| Select All | `Cmd+A` | `Ctrl+A` |

## Getting Started

### Prerequisites
- Node.js
- npm

### Install
```bash
npm install
```

### Run (development)
```bash
npm run dev
```

### Build distributables
```bash
# macOS (DMG — arm64 + x64 universal)
npm run dist:mac

# Windows (ZIP — x64)
npm run dist:win

# Both platforms
npm run dist:all
```

## Tech Stack

| Component | Technology |
|---|---|
| App shell | [Electron](https://www.electronjs.org/) |
| Editor | [CodeMirror 5](https://codemirror.net/5/) |
| Encoding | [iconv-lite](https://github.com/ashtuchkin/iconv-lite) |
| Language | TypeScript |

## License

MIT
