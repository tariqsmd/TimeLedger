# TimeLedger &middot; Task Management & Time Tracking Workspace

A comprehensive productivity application that combines **Kanban-style task management** with **built-in time tracking**, all wrapped in a beautiful, customizable interface. Choose between a visual board layout for structured project planning or a streamlined quick-ledger view for rapid task capture.

---

## ✨ Key Features

### 🎯 Two Workspace Layouts
- **Modern Board** &mdash; Kanban-style columns (To Do / In Progress / Completed) with drag-and-drop
- **Quick Ledger** &mdash; Streamlined, list-focused view for fast task entry and note-taking

### ⏱️ Built-in Time Tracking
- Start / Pause / Resume / Stop timers on every task
- Live accumulated time display (hours, minutes, seconds)
- Time automatically preserves across sessions

### 👁️ Three View Modes
1. **Board** &mdash; Kanban columns with drag-to-status workflow
2. **List** &mdash; Compact, sortable task rows
3. **Table** &mdash; Spreadsheet-style master list with all metadata

### 🏷️ Organization Tools
- **Categories / Groups** with custom colors
- **Labels** (Urgent, Bug, Feature, and custom)
- **Priorities**: Low / Medium / High
- **Due Dates** with overdue highlighting
- **Card Cover Colors** for visual grouping

### ✅ Subtasks & Checklists
- Multiple nested checklists per task
- Per-checklist progress indicators
- Inline editable subtask text

### 📝 Rich Text Descriptions
- Powered by **TipTap** editor
- Bold, Italic, Headings, Lists, Blockquotes, Code Blocks
- Placeholder support

### 🎨 Customizable UI
- **10 Color Themes**: Premium Indigo, Deep Midnight, Forest Emerald, Golden Sunset, Velvet Rose, Oceanic Blue, Royal Purple, Carbon Black, Neon Lime, Cyber Pink
- **Typography**: 15+ body fonts, 15+ heading fonts with adjustable weights
- **Backgrounds**: Solid color, CSS gradient, or custom image (upload + preset Unsplash gallery)

### 🔍 Search & Sort
- Global fuzzy search across task titles, descriptions, and categories
- Sort by: Date Created, Priority, Due Date, or Alphabetical

### 💾 Data Persistence
- **Browser** &mdash; All settings saved locally via `localStorage`
- **Optional Server** &mdash; Express backend saves tasks to JSON files (port 5175)
- **Load Samples** button to quickly seed with demo data

### ⚡ Cross-Platform Ready
- Pure **React + Vite** web app (runs in any modern browser)
- Optional **Electron** desktop build for Windows / macOS / Linux

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Web Development (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Run the backend (for JSON persistence & image uploads)
#    + the frontend dev server together:
npm start

# 3. Or run them separately:
npm run server   # Terminal 1 -> http://localhost:5175
npm run dev      # Terminal 2 -> http://localhost:5173
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build
npm run preview
```

### Desktop App (Electron)

```bash
# Dev mode (frontend + server + Electron window)
npm run electron:start

# Build installers (all platforms)
npm run electron:build

# Platform-specific
npm run electron:build:win
npm run electron:build:mac
npm run electron:build:linux
```

---

## 📖 Usage Guide

### Creating Tasks
1. Click **"Add Task"** in the header (Quick Task form)
2. Or use the **inline "+ Add a task"** trigger at the bottom of any board column / list / table
3. Click any existing card to open the full editor

### Tracking Time
Inside any task card:
- **Start** &mdash; begins the timer (`status: running`)
- **Pause** &mdash; preserves elapsed time (`status: paused`)
- **Resume** &mdash; continues from paused time
- **Stop** &mdash; stops without marking complete (keeps accumulated time)
- **Restart** &mdash; zeros out all timers for the task
- Toggling the task **checkbox** also stops the timer and marks it complete

### Board Columns
- **Add** a new column with the **"+ Add Category Column"** card
- **Rename** is on the roadmap (for now, edit `customBoards` via DevTools or localStorage)
- **Remove** a column with the `×` button on its header (2+ columns required)

### Customization
Open the **⚙️ Settings** sidebar (gear icon top-right) to change:
- **Typography** &mdash; body + heading fonts and weights
- **Background** &mdash; color, gradient, or image (drag-and-drop uploads stored in `/uploads`)
- **Color Theme** &mdash; 10 curated palettes
- **Layout switcher** &mdash; toggle Modern board vs Quick ledger
- **View mode** &mdash; Board / List / Table
- **Sort order** &mdash; Date / Priority / Due date / A-Z

---

## 🏗️ Project Structure

```
TimeLedger/
├── src/
│   ├── assets/
│   │   └── Icons.jsx             # All SVG icon components
│   ├── components/
│   │   ├── Common/               # Search, TimeDisplay, ProgressWidget, LayoutView, RichEditor
│   │   ├── Layout/               # Header, Sidebar, StartWindow
│   │   ├── QuickTasks/           # QuickTaskModal (add/edit + full table view)
│   │   └── Todo/                 # Board, TodoItem, TodoView (main board + list + table), useTodoUtils
│   ├── styles/
│   │   └── main.scss             # Global styles + CSS variables for themes
│   ├── utils/
│   │   ├── AppContext.jsx        # Main todos + settings state + server sync
│   │   ├── QuickTasksContext.jsx # Quick tasks + layout selection + combined tasks
│   │   ├── useLocalStorage.js    # Persistence hook
│   │   ├── useElectron.js        # Electron lifecycle + beforeunload save
│   │   ├── Helpers.jsx           # Date/time formatters
│   │   ├── appData.js            # Sample seed data
│   │   ├── appData.json          # Persisted main tasks (auto-generated)
│   │   └── quickTasksData.json   # Persisted quick tasks (auto-generated)
│   ├── App.jsx
│   └── main.jsx
├── uploads/                      # Background image uploads (auto-created)
├── server.js                     # Express API for JSON persistence + uploads
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔌 API Endpoints (server.js)

| Method | Endpoint                 | Description                           |
|--------|--------------------------|---------------------------------------|
| GET    | `/api/tasks`             | Read main tasks from `appData.json`   |
| POST   | `/api/tasks`             | Write `{ tasks: [...] }` to file      |
| GET    | `/api/quick-tasks`       | Read quick tasks from JSON file       |
| POST   | `/api/quick-tasks`       | Write quick tasks to JSON file        |
| POST   | `/api/upload`            | Upload base64 image → return URL      |
| GET    | `/api/uploads`           | List uploaded image URLs              |

All data is stored as plain JSON under `src/utils/` &mdash; easy to backup, migrate, or edit manually.

---

## 💡 Tips for Success

1. **Start with StartWindow** &mdash; on first launch, pick **Modern** for structured project work or **Quick** for brain-dump style capture. You can switch any time from the sidebar.
2. **Use Board view + timer together** &mdash; drag a card to "In Progress" and hit Start. Drag to "Completed" and hit the checkbox.
3. **Theme it** &mdash; try different color palettes and backgrounds throughout the day to keep the workspace fresh.
4. **Back up the JSON files** in `src/utils/*.json` regularly if you rely on the server persistence.
5. **Use the Quick Ledger** during meetings or reviews to dump items fast, then triage them into the board later.

---

## 🛣️ Roadmap Ideas (Community Welcomed!)

- Subtask time-tracking rollups
- Calendar / Gantt view
- JSON import / export button in the UI
- Team collaboration via shared JSON or WebSocket sync
- Recurring tasks
- Offline PWA (Service Worker)
- Tag and category management UI (rename / delete / reorder)

---

## 📄 License

MIT &mdash; free to use, modify, and distribute for personal or commercial use.

---

Made with ❤️ by **Muhammad Tariq**
