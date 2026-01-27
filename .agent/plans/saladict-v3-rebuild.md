# Saladict V3 - Rebuild Plan (Manifest V3)

**Project Type:** Chrome Extension (Manifest V3)  
**Tech Stack:** Vite + React 18 + TypeScript + Zustand  
**Boilerplate:** [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)  
**Status:** 🟡 Planning Phase

---

## 📋 Executive Summary

Rebuild Saladict từ đầu với:
- ✅ **Manifest V3** (Service Worker thay vì background page)
- ✅ **Modern Stack** (Vite thay vì Webpack, Zustand thay vì Redux)
- ✅ **Simplified Architecture** (Giảm complexity, tập trung core features)
- ✅ **UI-First Approach** (Build UI trước, integrate logic sau)

### Core Features (MVP)
1. **Text Selection Flow** - Bôi đen text → Icon xuất hiện → Click mở popup
2. **Dictionary Lookup** - Tra từ từ 2-3 nguồn chính (Google Translate, Bing, Cambridge)
3. **Audio Pronunciation** - Phát âm từ vựng
4. **Notebook** - Lưu từ vựng đã tra
5. **History** - Lịch sử tra cứu

---

## 🎯 Phase 1: Project Setup & Boilerplate Integration

### 1.1 Initialize New Project

**Goal:** Tạo project mới từ boilerplate và verify build thành công

**Tasks:**
- [ ] Clone boilerplate vào thư mục mới `ext-saladict-v3`
- [ ] Verify build và load extension vào Chrome
- [ ] Customize `manifest.json` (name, description, permissions)
- [ ] Setup Git repository và initial commit

**Commands:**
```bash
# Tạo project mới
cd c:\Users\huyfa\Favorites\Learn\Chrome
npx degit Jonghakseo/chrome-extension-boilerplate-react-vite ext-saladict-v3
cd ext-saladict-v3

# Install dependencies
npm install

# Build và verify
npm run build
```

**Verification:**
- Extension load thành công trong `chrome://extensions/`
- Popup, content script, background service worker hoạt động
- Hot reload working trong dev mode

**Estimated Time:** 1 hour

---

### 1.2 Project Structure Setup

**Goal:** Tổ chức cấu trúc thư mục theo architecture mới

**Proposed Structure:**
```
ext-saladict-v3/
├── src/
│   ├── pages/
│   │   ├── popup/              # Popup chính (tra từ)
│   │   ├── options/            # Settings page
│   │   ├── notebook/           # Notebook page
│   │   └── history/            # History page
│   ├── content/
│   │   ├── selection-ui/       # Icon + tooltip khi bôi đen text
│   │   └── injected/           # Script inject vào page
│   ├── background/
│   │   ├── service-worker.ts   # Main service worker
│   │   └── handlers/           # Message handlers
│   ├── shared/
│   │   ├── components/         # Shared React components
│   │   ├── hooks/              # Custom hooks
│   │   ├── stores/             # Zustand stores
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   └── constants/          # Constants
│   ├── dictionaries/
│   │   ├── google/             # Google Translate engine
│   │   ├── bing/               # Bing Translator engine
│   │   └── cambridge/          # Cambridge Dictionary engine
│   └── assets/
│       ├── icons/
│       └── styles/
```

**Tasks:**
- [ ] Tạo folder structure như trên
- [ ] Setup path aliases trong `vite.config.ts` (`@/`, `@shared/`, `@dictionaries/`)
- [ ] Tạo `README.md` với hướng dẫn development

**Verification:**
- Import với alias hoạt động: `import { X } from '@shared/utils'`

**Estimated Time:** 30 minutes

---

### 1.3 Development Environment

**Goal:** Setup tooling và development workflow

**Tasks:**
- [ ] Setup ESLint + Prettier (theo `@[skills/clean-code]`)
- [ ] Configure TypeScript strict mode
- [ ] Setup Zustand DevTools
- [ ] Add VS Code workspace settings (`.vscode/settings.json`)

**VS Code Extensions Recommended:**
- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense (nếu dùng Tailwind)

**Verification:**
- Linting hoạt động
- Format on save working
- TypeScript errors hiển thị trong editor

**Estimated Time:** 30 minutes

---

## 🎨 Phase 2: UI Design & Component Library

### 2.1 Design System Setup

**Goal:** Tạo design system cơ bản (colors, typography, spacing)

**Reference:** `@[skills/frontend-design]` - NO PURPLE, NO TEMPLATES

**Tasks:**
- [ ] Define color palette (primary, secondary, accent, neutrals)
  - **Constraint:** NO violet/purple colors
  - **Inspiration:** Modern dictionary apps (Merriam-Webster, Cambridge)
- [ ] Define typography scale (font families, sizes, weights)
- [ ] Define spacing scale (4px base grid)
- [ ] Create CSS variables hoặc Tailwind config

**Design Decisions:**
```typescript
// Example: src/shared/constants/theme.ts
export const COLORS = {
  primary: {
    50: '#e6f7ff',
    500: '#1890ff',  // Blue - professional, trustworthy
    700: '#0050b3',
  },
  accent: {
    500: '#52c41a',  // Green - success, learning
  },
  neutral: {
    50: '#fafafa',
    900: '#141414',
  }
}
```

**Verification:**
- Design tokens documented
- Colors accessible (WCAG AA contrast ratio)

**Estimated Time:** 2 hours

---

### 2.2 Core Components

**Goal:** Build reusable components theo design system

**Components to Build:**
- [ ] `Button` (primary, secondary, ghost variants)
- [ ] `Input` (text input với search icon)
- [ ] `Card` (container cho dictionary results)
- [ ] `IconButton` (cho audio, bookmark, close)
- [ ] `Spinner` (loading state)
- [ ] `Tooltip` (hiển thị hints)
- [ ] `Tabs` (switch giữa dictionaries)

**Implementation Guide:**
- Dùng **compound components** pattern khi cần
- Support **dark mode** từ đầu
- **Accessibility:** ARIA labels, keyboard navigation
- **NO over-engineering:** Keep it simple

**Example:**
```tsx
// src/shared/components/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementation
}
```

**Verification:**
- Components render correctly
- Dark mode toggle working
- Keyboard accessible

**Estimated Time:** 4 hours

---

### 2.3 Selection UI Design

**Goal:** Thiết kế UI cho flow "bôi đen text → icon xuất hiện"

**Reference Flow (Saladict V2):**
1. User bôi đen text trên trang web
2. Icon nhỏ xuất hiện gần selection (floating)
3. Click icon → Popup mở ra với kết quả tra từ

**Design Requirements:**
- Icon phải **eye-catching** nhưng **non-intrusive**
- Animation mượt mà (fade in/out)
- Position thông minh (không bị che bởi UI của trang web)
- Responsive với selection dài/ngắn

**Tasks:**
- [ ] Design icon (SVG, 24x24px)
- [ ] Design tooltip container
- [ ] Define animation (CSS transitions)
- [ ] Handle edge cases (selection ở góc màn hình, iframe)

**UI Mockup (Text Description):**
```
┌─────────────────────────────┐
│ This is some text on a      │
│ webpage. When user selects  │
│ "dictionary" word...        │
│                             │
│ ...a floating icon appears: │
│                             │
│   [selected text]  [🔍]    │  ← Icon floats near selection
│                             │
└─────────────────────────────┘
```

**Verification:**
- Icon xuất hiện đúng vị trí
- Animation mượt
- Không conflict với UI của trang web

**Estimated Time:** 3 hours

---

### 2.4 Popup UI Design

**Goal:** Thiết kế popup chính để hiển thị kết quả tra từ

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ 🔍 [Search Input]          [⚙️] [✕] │  ← Header
├─────────────────────────────────────┤
│ 📖 Google | Bing | Cambridge        │  ← Tabs
├─────────────────────────────────────┤
│                                     │
│  [Dictionary Result Content]        │  ← Main content
│  - Pronunciation                    │
│  - Definitions                      │
│  - Examples                         │
│                                     │
├─────────────────────────────────────┤
│ [🔊 Audio] [⭐ Save] [📋 History]   │  ← Actions
└─────────────────────────────────────┘
```

**Tasks:**
- [ ] Design header (search bar, settings icon, close button)
- [ ] Design tab navigation (dictionary switcher)
- [ ] Design result card layout
- [ ] Design action buttons (audio, save, history)
- [ ] Design loading state
- [ ] Design error state (no results, network error)

**Responsive Behavior:**
- Popup width: 400px (desktop), 100vw (mobile)
- Max height: 600px, scrollable content

**Verification:**
- Layout responsive
- Scrolling smooth
- States (loading, error, success) clear

**Estimated Time:** 4 hours

---

### 2.5 Notebook & History UI

**Goal:** Design pages cho Notebook và History

**Notebook Page:**
```
┌─────────────────────────────────────┐
│ 📚 My Notebook          [+ Add New] │
├─────────────────────────────────────┤
│ 🔍 [Search saved words...]          │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ dictionary (n.)                 │ │
│ │ /ˈdɪkʃəneri/                    │ │
│ │ A book that lists words...      │ │
│ │ [🔊] [🗑️]          Added: 2h ago │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ translate (v.)                  │ │
│ │ ...                             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**History Page:**
- Similar layout, but with timestamp sorting
- Filter by date range
- Clear history button

**Tasks:**
- [ ] Design notebook list view
- [ ] Design word card component
- [ ] Design search/filter UI
- [ ] Design empty state ("No saved words yet")

**Verification:**
- List scrollable
- Search responsive
- Empty state clear

**Estimated Time:** 3 hours

---

## 🔧 Phase 3: Core Functionality Implementation

### 3.1 Zustand Store Setup

**Goal:** Setup state management với Zustand

**Stores to Create:**
- `useAppStore` - Global app state (theme, settings)
- `useDictionaryStore` - Dictionary results, loading states
- `useNotebookStore` - Saved words
- `useHistoryStore` - Search history

**Example:**
```typescript
// src/shared/stores/useDictionaryStore.ts
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface DictionaryState {
  currentWord: string
  results: Record<string, DictionaryResult>
  loading: boolean
  error: string | null
  
  // Actions
  searchWord: (word: string) => Promise<void>
  clearResults: () => void
}

export const useDictionaryStore = create<DictionaryState>()(
  devtools(
    persist(
      (set, get) => ({
        currentWord: '',
        results: {},
        loading: false,
        error: null,
        
        searchWord: async (word) => {
          set({ loading: true, error: null })
          try {
            // Fetch from dictionaries
            const results = await fetchDictionaries(word)
            set({ currentWord: word, results, loading: false })
          } catch (error) {
            set({ error: error.message, loading: false })
          }
        },
        
        clearResults: () => set({ results: {}, currentWord: '' })
      }),
      { name: 'dictionary-store' }
    )
  )
)
```

**Tasks:**
- [ ] Create all stores
- [ ] Add TypeScript types
- [ ] Setup persistence (chrome.storage.local)
- [ ] Add DevTools integration

**Verification:**
- Stores accessible from components
- State persists across sessions
- DevTools show state changes

**Estimated Time:** 3 hours

---

### 3.2 Text Selection Detection

**Goal:** Implement logic để detect khi user bôi đen text

**Implementation:**
```typescript
// src/content/selection-ui/SelectionDetector.ts
export class SelectionDetector {
  private selectionTimeout: NodeJS.Timeout | null = null
  
  constructor(private onSelectionChange: (text: string) => void) {
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('selectionchange', this.handleSelectionChange)
  }
  
  private handleMouseUp = () => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()
    
    if (text && text.length > 0) {
      this.onSelectionChange(text)
    }
  }
  
  private handleSelectionChange = () => {
    // Debounce để tránh trigger quá nhiều
    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout)
    }
    
    this.selectionTimeout = setTimeout(() => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()
      
      if (text && text.length > 0) {
        this.onSelectionChange(text)
      }
    }, 300)
  }
  
  destroy() {
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('selectionchange', this.handleSelectionChange)
  }
}
```

**Tasks:**
- [ ] Implement SelectionDetector class
- [ ] Handle edge cases (selection trong iframe, shadow DOM)
- [ ] Add debouncing để optimize performance
- [ ] Test trên nhiều loại trang web (Wikipedia, Medium, Gmail)

**Verification:**
- Selection detected chính xác
- Không lag khi select text nhanh
- Hoạt động trên các trang web phổ biến

**Estimated Time:** 2 hours

---

### 3.3 Floating Icon Component

**Goal:** Implement icon xuất hiện khi bôi đen text

**Implementation:**
```tsx
// src/content/selection-ui/FloatingIcon.tsx
import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

interface FloatingIconProps {
  selectedText: string
  position: { x: number; y: number }
  onIconClick: () => void
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
  selectedText,
  position,
  onIconClick
}) => {
  return (
    <div
      className="saladict-floating-icon"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 999999,
      }}
      onClick={onIconClick}
    >
      <button className="icon-button">
        🔍
      </button>
    </div>
  )
}

// Inject vào page
export function showFloatingIcon(text: string, rect: DOMRect) {
  const container = document.createElement('div')
  container.id = 'saladict-floating-icon-root'
  document.body.appendChild(container)
  
  const root = createRoot(container)
  root.render(
    <FloatingIcon
      selectedText={text}
      position={{ x: rect.right + 5, y: rect.top }}
      onIconClick={() => {
        // Send message to open popup
        chrome.runtime.sendMessage({ type: 'OPEN_POPUP', text })
      }}
    />
  )
}
```

**Tasks:**
- [ ] Implement FloatingIcon component
- [ ] Calculate position (avoid overflow, consider scroll)
- [ ] Add animation (fade in/out)
- [ ] Handle click to open popup
- [ ] Cleanup khi user deselect

**Verification:**
- Icon xuất hiện đúng vị trí
- Animation mượt
- Click mở popup thành công

**Estimated Time:** 3 hours

---

### 3.4 Dictionary Engine - Google Translate

**Goal:** Implement engine đầu tiên (Google Translate)

**API Options:**
1. **Google Translate API** (Official, cần API key, có phí)
2. **Unofficial API** (Free, có thể bị block)
3. **Web Scraping** (Fetch HTML và parse)

**Recommended:** Start với unofficial API, sau đó support official API

**Implementation:**
```typescript
// src/dictionaries/google/engine.ts
import axios from 'axios'

export interface GoogleTranslateResult {
  text: string
  translation: string
  pronunciation?: string
  detectedLanguage: string
}

export async function translateWithGoogle(
  text: string,
  targetLang: string = 'vi'
): Promise<GoogleTranslateResult> {
  try {
    // Using unofficial API endpoint
    const response = await axios.get(
      `https://translate.googleapis.com/translate_a/single`,
      {
        params: {
          client: 'gtx',
          sl: 'auto',
          tl: targetLang,
          dt: 't',
          q: text,
        }
      }
    )
    
    const translation = response.data[0][0][0]
    const detectedLang = response.data[2]
    
    return {
      text,
      translation,
      detectedLanguage: detectedLang,
    }
  } catch (error) {
    throw new Error(`Google Translate failed: ${error.message}`)
  }
}
```

**Tasks:**
- [ ] Implement Google Translate engine
- [ ] Add error handling
- [ ] Add retry logic (3 attempts)
- [ ] Test với nhiều ngôn ngữ (en→vi, vi→en, ja→vi)

**Verification:**
- Translation chính xác
- Error handling robust
- Performance acceptable (<2s)

**Estimated Time:** 2 hours

---

### 3.5 Dictionary Result Component

**Goal:** Component để hiển thị kết quả từ dictionary

**Implementation:**
```tsx
// src/shared/components/DictionaryResult/GoogleResult.tsx
import { GoogleTranslateResult } from '@dictionaries/google/engine'

interface GoogleResultProps {
  result: GoogleTranslateResult
  onPlayAudio?: () => void
}

export const GoogleResult: React.FC<GoogleResultProps> = ({
  result,
  onPlayAudio
}) => {
  return (
    <div className="dictionary-result">
      <div className="result-header">
        <h3>{result.text}</h3>
        {result.pronunciation && (
          <span className="pronunciation">{result.pronunciation}</span>
        )}
        <button onClick={onPlayAudio}>🔊</button>
      </div>
      
      <div className="result-body">
        <div className="translation">
          <strong>Translation:</strong>
          <p>{result.translation}</p>
        </div>
        
        <div className="detected-language">
          Detected: {result.detectedLanguage}
        </div>
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] Implement result components cho từng dictionary
- [ ] Add loading skeleton
- [ ] Add error state UI
- [ ] Style theo design system

**Verification:**
- Results render correctly
- Loading state smooth
- Error messages clear

**Estimated Time:** 2 hours

---

### 3.6 Audio Pronunciation

**Goal:** Implement phát âm từ vựng

**Options:**
1. **Google TTS API** (text-to-speech)
2. **Web Speech API** (browser native)
3. **Third-party services** (Forvo, etc.)

**Recommended:** Start với Web Speech API (free, no API key)

**Implementation:**
```typescript
// src/shared/utils/audio.ts
export class AudioPlayer {
  private synth = window.speechSynthesis
  
  async playText(text: string, lang: string = 'en-US') {
    // Cancel any ongoing speech
    this.synth.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9 // Slightly slower for clarity
    
    return new Promise<void>((resolve, reject) => {
      utterance.onend = () => resolve()
      utterance.onerror = (error) => reject(error)
      
      this.synth.speak(utterance)
    })
  }
  
  stop() {
    this.synth.cancel()
  }
}

export const audioPlayer = new AudioPlayer()
```

**Tasks:**
- [ ] Implement AudioPlayer class
- [ ] Add language detection
- [ ] Add fallback (nếu Web Speech API không available)
- [ ] Add loading state khi playing

**Verification:**
- Audio plays correctly
- Language detection accurate
- Fallback working

**Estimated Time:** 2 hours

---

### 3.7 Notebook Feature

**Goal:** Implement lưu từ vựng vào notebook

**Storage Decision:**
- **Option 1:** `chrome.storage.local` (simple, 5MB limit)
- **Option 2:** IndexedDB với Dexie (unlimited, complex)

**Recommended:** Start với `chrome.storage.local`, migrate to IndexedDB nếu cần

**Implementation:**
```typescript
// src/shared/stores/useNotebookStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SavedWord {
  id: string
  word: string
  translation: string
  pronunciation?: string
  source: string // 'google' | 'bing' | 'cambridge'
  savedAt: number
  notes?: string
}

interface NotebookState {
  words: SavedWord[]
  
  addWord: (word: Omit<SavedWord, 'id' | 'savedAt'>) => void
  removeWord: (id: string) => void
  searchWords: (query: string) => SavedWord[]
}

export const useNotebookStore = create<NotebookState>()(
  persist(
    (set, get) => ({
      words: [],
      
      addWord: (word) => {
        const newWord: SavedWord = {
          ...word,
          id: crypto.randomUUID(),
          savedAt: Date.now(),
        }
        set((state) => ({ words: [newWord, ...state.words] }))
      },
      
      removeWord: (id) => {
        set((state) => ({
          words: state.words.filter((w) => w.id !== id)
        }))
      },
      
      searchWords: (query) => {
        const { words } = get()
        return words.filter((w) =>
          w.word.toLowerCase().includes(query.toLowerCase())
        )
      },
    }),
    {
      name: 'notebook-storage',
      storage: {
        getItem: async (name) => {
          const result = await chrome.storage.local.get(name)
          return result[name]
        },
        setItem: async (name, value) => {
          await chrome.storage.local.set({ [name]: value })
        },
        removeItem: async (name) => {
          await chrome.storage.local.remove(name)
        },
      }
    }
  )
)
```

**Tasks:**
- [ ] Implement notebook store
- [ ] Add CRUD operations
- [ ] Add search/filter
- [ ] Sync với chrome.storage

**Verification:**
- Words saved correctly
- Search working
- Data persists across sessions

**Estimated Time:** 3 hours

---

### 3.8 History Feature

**Goal:** Implement lịch sử tra cứu

**Similar to Notebook, but:**
- Auto-save mỗi lần tra từ
- Limit 100 entries (FIFO)
- Group by date

**Implementation:**
```typescript
// src/shared/stores/useHistoryStore.ts
interface HistoryEntry {
  id: string
  word: string
  searchedAt: number
}

interface HistoryState {
  entries: HistoryEntry[]
  maxEntries: number
  
  addEntry: (word: string) => void
  clearHistory: () => void
  getEntriesByDate: (date: Date) => HistoryEntry[]
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      maxEntries: 100,
      
      addEntry: (word) => {
        const newEntry: HistoryEntry = {
          id: crypto.randomUUID(),
          word,
          searchedAt: Date.now(),
        }
        
        set((state) => {
          const newEntries = [newEntry, ...state.entries]
          // Keep only last 100 entries
          return {
            entries: newEntries.slice(0, state.maxEntries)
          }
        })
      },
      
      clearHistory: () => set({ entries: [] }),
      
      getEntriesByDate: (date) => {
        const { entries } = get()
        const startOfDay = new Date(date).setHours(0, 0, 0, 0)
        const endOfDay = new Date(date).setHours(23, 59, 59, 999)
        
        return entries.filter(
          (e) => e.searchedAt >= startOfDay && e.searchedAt <= endOfDay
        )
      },
    }),
    { name: 'history-storage' }
  )
)
```

**Tasks:**
- [ ] Implement history store
- [ ] Add auto-save on search
- [ ] Add date grouping
- [ ] Add clear history function

**Verification:**
- History saves automatically
- Limit enforced (100 entries)
- Date grouping correct

**Estimated Time:** 2 hours

---

## 🔗 Phase 4: Integration & Communication

### 4.1 Message Passing Architecture

**Goal:** Setup communication giữa content script, popup, và service worker

**Message Types:**
```typescript
// src/shared/types/messages.ts
export type Message =
  | { type: 'SEARCH_WORD'; payload: { word: string } }
  | { type: 'SAVE_TO_NOTEBOOK'; payload: { word: SavedWord } }
  | { type: 'PLAY_AUDIO'; payload: { text: string; lang: string } }
  | { type: 'OPEN_POPUP'; payload: { word: string } }

export type MessageResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
}
```

**Implementation:**
```typescript
// src/background/service-worker.ts
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  switch (message.type) {
    case 'SEARCH_WORD':
      handleSearchWord(message.payload).then(sendResponse)
      return true // Async response
      
    case 'SAVE_TO_NOTEBOOK':
      handleSaveToNotebook(message.payload).then(sendResponse)
      return true
      
    // ... other handlers
  }
})

async function handleSearchWord({ word }: { word: string }) {
  try {
    const results = await fetchAllDictionaries(word)
    return { success: true, data: results }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

**Tasks:**
- [ ] Define message types
- [ ] Implement service worker handlers
- [ ] Implement content script sender
- [ ] Implement popup sender
- [ ] Add error handling

**Verification:**
- Messages sent/received correctly
- Async responses working
- Error handling robust

**Estimated Time:** 3 hours

---

### 4.2 Content Script Integration

**Goal:** Integrate selection detection + floating icon vào content script

**Implementation:**
```typescript
// src/content/index.ts
import { SelectionDetector } from './selection-ui/SelectionDetector'
import { showFloatingIcon, hideFloatingIcon } from './selection-ui/FloatingIcon'

// Initialize selection detector
const detector = new SelectionDetector((text) => {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return
  
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  
  // Show floating icon
  showFloatingIcon(text, rect)
})

// Listen for deselection
document.addEventListener('mousedown', (e) => {
  // If click outside selection, hide icon
  if (!e.target.closest('.saladict-floating-icon')) {
    hideFloatingIcon()
  }
})
```

**Tasks:**
- [ ] Integrate SelectionDetector
- [ ] Integrate FloatingIcon
- [ ] Handle cleanup on page navigation
- [ ] Test on various websites

**Verification:**
- Icon appears on text selection
- Icon disappears on deselection
- No memory leaks

**Estimated Time:** 2 hours

---

### 4.3 Popup Integration

**Goal:** Integrate popup với dictionary stores và message passing

**Implementation:**
```tsx
// src/pages/popup/Popup.tsx
import { useEffect } from 'react'
import { useDictionaryStore } from '@shared/stores/useDictionaryStore'
import { useNotebookStore } from '@shared/stores/useNotebookStore'
import { GoogleResult } from '@shared/components/DictionaryResult/GoogleResult'

export const Popup = () => {
  const { currentWord, results, loading, searchWord } = useDictionaryStore()
  const { addWord } = useNotebookStore()
  
  useEffect(() => {
    // Listen for messages from content script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'OPEN_POPUP') {
        searchWord(message.payload.word)
      }
    })
  }, [])
  
  const handleSaveToNotebook = () => {
    if (results.google) {
      addWord({
        word: currentWord,
        translation: results.google.translation,
        source: 'google',
      })
    }
  }
  
  return (
    <div className="popup-container">
      <header>
        <input
          type="text"
          placeholder="Search..."
          value={currentWord}
          onChange={(e) => searchWord(e.target.value)}
        />
      </header>
      
      <main>
        {loading && <Spinner />}
        {results.google && <GoogleResult result={results.google} />}
      </main>
      
      <footer>
        <button onClick={handleSaveToNotebook}>⭐ Save</button>
      </footer>
    </div>
  )
}
```

**Tasks:**
- [ ] Implement popup component
- [ ] Connect to stores
- [ ] Handle message from content script
- [ ] Add search input
- [ ] Add save to notebook button

**Verification:**
- Popup opens with selected word
- Search working
- Save to notebook working

**Estimated Time:** 3 hours

---

## 🚀 Phase 5: Polish & Optimization

### 5.1 Performance Optimization

**Goal:** Optimize performance theo `@[skills/performance-profiling]`

**Tasks:**
- [ ] Lazy load dictionary engines
- [ ] Debounce search input
- [ ] Optimize re-renders (React.memo, useMemo)
- [ ] Reduce bundle size (code splitting)
- [ ] Measure Core Web Vitals

**Verification:**
- Popup opens <100ms
- Search results <2s
- Bundle size <500KB

**Estimated Time:** 3 hours

---

### 5.2 Error Handling & Edge Cases

**Goal:** Handle edge cases và errors gracefully

**Edge Cases:**
- [ ] No internet connection
- [ ] Dictionary API down
- [ ] Invalid text selection (emojis, special chars)
- [ ] Popup opened without selection
- [ ] Storage quota exceeded

**Tasks:**
- [ ] Add error boundaries
- [ ] Add retry logic
- [ ] Add offline detection
- [ ] Add user-friendly error messages

**Verification:**
- No crashes
- Error messages clear
- Graceful degradation

**Estimated Time:** 2 hours

---

### 5.3 Accessibility (A11y)

**Goal:** Ensure extension accessible theo WCAG 2.1 AA

**Tasks:**
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] ARIA labels
- [ ] Focus management
- [ ] Screen reader testing
- [ ] Color contrast check

**Verification:**
- Keyboard navigation working
- Screen reader announces correctly
- Color contrast ≥4.5:1

**Estimated Time:** 2 hours

---

### 5.4 Testing

**Goal:** Add tests cho core functionality

**Test Types:**
- **Unit Tests:** Utility functions, stores
- **Integration Tests:** Message passing, API calls
- **E2E Tests:** User flows (select text → see result)

**Tasks:**
- [ ] Setup Vitest
- [ ] Write unit tests (stores, utils)
- [ ] Write integration tests (API mocking)
- [ ] Write E2E tests (Playwright)

**Verification:**
- Test coverage >70%
- All critical paths tested

**Estimated Time:** 4 hours

---

## 📦 Phase 6: Build & Deployment

### 6.1 Production Build

**Goal:** Build extension cho production

**Tasks:**
- [ ] Update manifest.json (version, permissions)
- [ ] Optimize assets (compress images, minify CSS)
- [ ] Generate source maps (for debugging)
- [ ] Create build script

**Commands:**
```bash
npm run build
```

**Verification:**
- Build successful
- Extension loads in Chrome
- All features working

**Estimated Time:** 1 hour

---

### 6.2 Chrome Web Store Submission

**Goal:** Submit extension lên Chrome Web Store

**Requirements:**
- [ ] Screenshots (1280x800, 5 images)
- [ ] Promotional images (440x280)
- [ ] Description (English + Vietnamese)
- [ ] Privacy policy (if collecting data)
- [ ] Developer account ($5 one-time fee)

**Tasks:**
- [ ] Create screenshots
- [ ] Write description
- [ ] Prepare privacy policy
- [ ] Submit to Chrome Web Store
- [ ] Wait for review (2-3 days)

**Estimated Time:** 2 hours

---

## 📊 Summary

### Total Estimated Time: **60-70 hours**

### Phase Breakdown:
- **Phase 1:** Project Setup (2h)
- **Phase 2:** UI Design (16h)
- **Phase 3:** Core Functionality (18h)
- **Phase 4:** Integration (8h)
- **Phase 5:** Polish (11h)
- **Phase 6:** Deployment (3h)

### Key Milestones:
1. ✅ **Week 1:** Project setup + UI components
2. ✅ **Week 2:** Selection flow + Dictionary engine
3. ✅ **Week 3:** Notebook + History + Integration
4. ✅ **Week 4:** Polish + Testing + Deployment

---

## 🎯 Next Steps

1. **Review this plan** - Bạn có muốn adjust gì không?
2. **Create new project** - Clone boilerplate và setup
3. **Start Phase 1** - Tạo project structure
4. **Build UI first** - Theo yêu cầu của bạn

**Ready to start?** Mình có thể bắt đầu với Phase 1.1 ngay bây giờ! 🚀
