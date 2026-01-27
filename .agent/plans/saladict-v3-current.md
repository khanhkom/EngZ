# Saladict V3 - Rebuild Plan (Current Boilerplate)

**Project Type:** Chrome Extension (Manifest V3)  
**Tech Stack:** Vite + React 18 + TypeScript + Zustand + Tailwind CSS + Shadcn/ui  
**Boilerplate:** [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite) (Current)  
**Timeline:** 1 Week (AI-assisted development)  
**Approach:** UI-First + Hybrid Components (Shadcn/ui 70% + Custom 30%)  
**Status:** 🟡 Planning Phase

---

## 📋 Executive Summary

Rebuild Saladict V3 từ boilerplate hiện tại với:
- ✅ **Manifest V3** (Service Worker architecture)
- ✅ **Modern Stack** (Vite + React 18 + TypeScript + Zustand)
- ✅ **Tailwind CSS v4** + Shadcn/ui (rapid UI development)
- ✅ **UI-First Approach** (Build UI → Integrate logic → Polish)
- ✅ **1 Week Timeline** (AI-assisted, focus on core features)

### Core Features (MVP)
1. **Text Selection Flow** - Bôi đen text → Floating icon → Popup tra từ
2. **Dictionary Lookup** - Tra từ từ 3 nguồn (Google Translate, Bing, Cambridge)
3. **Audio Pronunciation** - Phát âm từ vựng (Web Speech API)
4. **Notebook** - Lưu từ vựng đã tra (chrome.storage.local)
5. **History** - Lịch sử tra cứu (100 entries, FIFO)

### UI Component Strategy
```
Shadcn/ui Components (70%):
├── Button, Input, Card, Tabs
├── Tooltip, Spinner, Dialog
└── Dropdown, Badge, Separator

Custom Components (30%):
├── FloatingIcon (selection UI)
├── DictionaryResult (Google, Bing, Cambridge)
├── WordCard (notebook/history items)
└── SelectionDetector (logic component)
```

---

## 🎯 Phase 0: Pre-Development Setup (Day 0 - 2 hours)

### 0.1 Verify Current Boilerplate

**Goal:** Đảm bảo boilerplate hiện tại hoạt động đúng

**Tasks:**
- [ ] Verify build thành công: `pnpm build`
- [ ] Load extension vào Chrome (`chrome://extensions/`)
- [ ] Test hot reload trong dev mode: `pnpm dev`
- [ ] Verify các pages hoạt động:
  - Background service worker
  - Popup (`pages/popup`)
  - Content script (`pages/content`)
  - Options page (`pages/options`)

**Verification:**
- Extension load thành công
- Console không có errors
- Hot reload working

**Estimated Time:** 30 minutes

---

### 0.2 Install Dependencies

**Goal:** Setup Tailwind CSS v4, Shadcn/ui, Zustand

**Commands:**
```bash
# Navigate to project root
cd c:\Users\huyfa\Favorites\Learn\Chrome\chrome-extension-boilerplate-react-vite

# Install Tailwind CSS v4 (CSS-first)
pnpm add -D tailwindcss@next @tailwindcss/vite@next

# Install Shadcn/ui dependencies
pnpm add class-variance-authority clsx tailwind-merge lucide-react

# Install Zustand
pnpm add zustand

# Install utility libraries
pnpm add axios date-fns nanoid
```

**Tasks:**
- [ ] Install all dependencies
- [ ] Setup Tailwind CSS v4 config (CSS-first approach)
- [ ] Initialize Shadcn/ui: `pnpx shadcn@latest init`
- [ ] Configure `components.json`

**Tailwind CSS v4 Setup:**
```css
/* chrome-extension/src/index.css */
@import "tailwindcss";

@theme {
  /* Design tokens */
  --color-primary-50: #e6f7ff;
  --color-primary-500: #1890ff;
  --color-primary-700: #0050b3;
  
  --color-accent-500: #52c41a;
  
  --color-neutral-50: #fafafa;
  --color-neutral-900: #141414;
  
  /* NO PURPLE/VIOLET - Purple Ban Rule */
  
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

**Shadcn/ui Config:**
```json
// components.json
{
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "chrome-extension/src/index.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Verification:**
- Tailwind classes working
- Shadcn/ui components importable
- No build errors

**Estimated Time:** 1 hour

---

### 0.3 Project Structure Setup

**Goal:** Tổ chức cấu trúc thư mục cho Saladict

**Current Structure Analysis:**
```
chrome-extension-boilerplate-react-vite/
├── chrome-extension/          # Manifest & build config
│   └── src/background/        # Service worker
├── pages/
│   ├── popup/                 # ✅ Use for main dictionary popup
│   ├── options/               # ✅ Use for settings
│   ├── content/               # ✅ Use for selection detection
│   ├── content-ui/            # ✅ Use for floating icon
│   └── new-tab/               # ❌ Not needed for Saladict
├── packages/
│   ├── shared/                # ✅ Add stores, types, utils here
│   ├── storage/               # ✅ Use for chrome.storage wrapper
│   └── ui/                    # ✅ Add Shadcn/ui components here
```

**New Structure (Additions):**
```
packages/
├── shared/
│   ├── stores/                # NEW: Zustand stores
│   │   ├── useDictionaryStore.ts
│   │   ├── useNotebookStore.ts
│   │   ├── useHistoryStore.ts
│   │   └── useAppStore.ts
│   ├── types/                 # NEW: TypeScript types
│   │   ├── dictionary.ts
│   │   ├── messages.ts
│   │   └── notebook.ts
│   ├── utils/                 # NEW: Utility functions
│   │   ├── audio.ts
│   │   └── position.ts
│   └── dictionaries/          # NEW: Dictionary engines
│       ├── google/
│       │   └── engine.ts
│       ├── bing/
│       │   └── engine.ts
│       └── cambridge/
│           └── engine.ts
├── ui/
│   └── components/            # NEW: Shadcn/ui + Custom
│       ├── ui/                # Shadcn/ui base components
│       │   ├── button.tsx
│       │   ├── input.tsx
│       │   ├── card.tsx
│       │   └── tabs.tsx
│       └── custom/            # Custom domain components
│           ├── FloatingIcon.tsx
│           ├── DictionaryResult.tsx
│           └── WordCard.tsx
pages/
├── popup/
│   └── src/
│       ├── Popup.tsx          # MODIFY: Main dictionary UI
│       └── components/        # NEW: Popup-specific components
├── content/
│   └── src/matches/all/
│       └── index.ts           # MODIFY: Selection detection
└── content-ui/
    └── src/matches/all/
        └── index.tsx          # MODIFY: Floating icon injection
```

**Tasks:**
- [ ] Create folder structure như trên
- [ ] Setup path aliases trong `tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "paths": {
        "@/*": ["./packages/*"],
        "@shared/*": ["./packages/shared/*"],
        "@ui/*": ["./packages/ui/*"],
        "@dictionaries/*": ["./packages/shared/dictionaries/*"]
      }
    }
  }
  ```
- [ ] Update `vite.config.mts` với aliases
- [ ] Create placeholder files (empty exports)

**Verification:**
- Import với alias hoạt động: `import { X } from '@shared/stores'`
- No TypeScript errors

**Estimated Time:** 30 minutes

---

## 🎨 Phase 1: UI Foundation (Day 1 - 6 hours)

### 1.1 Design System Setup

**Goal:** Define design tokens theo `@[skills/frontend-design]` (NO PURPLE)

**Reference:** Modern dictionary apps (Merriam-Webster, Cambridge, Google Translate)

**Color Palette Decision:**
```typescript
// packages/shared/constants/theme.ts
export const COLORS = {
  // Primary: Professional Blue (trust, clarity)
  primary: {
    50: '#e6f7ff',
    100: '#bae7ff',
    200: '#91d5ff',
    300: '#69c0ff',
    400: '#40a9ff',
    500: '#1890ff',  // Main
    600: '#096dd9',
    700: '#0050b3',
    800: '#003a8c',
    900: '#002766',
  },
  
  // Accent: Success Green (learning, growth)
  accent: {
    50: '#f6ffed',
    500: '#52c41a',
    700: '#389e0d',
  },
  
  // Semantic colors
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1890ff',
  
  // Neutrals (for text, backgrounds)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e8e8e8',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#141414',
  },
} as const

export const TYPOGRAPHY = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const

export const ANIMATIONS = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const
```

**Tasks:**
- [ ] Create `packages/shared/constants/theme.ts`
- [ ] Update Tailwind config với design tokens
- [ ] Add Google Fonts (Inter) to `index.html`
- [ ] Verify color contrast (WCAG AA: ≥4.5:1)

**Verification:**
- Design tokens accessible
- Colors pass contrast check
- Fonts load correctly

**Estimated Time:** 1.5 hours

---

### 1.2 Install Shadcn/ui Base Components

**Goal:** Install base components từ Shadcn/ui

**Components to Install:**
```bash
# Base components
pnpx shadcn@latest add button
pnpx shadcn@latest add input
pnpx shadcn@latest add card
pnpx shadcn@latest add tabs
pnpx shadcn@latest add tooltip
pnpx shadcn@latest add badge
pnpx shadcn@latest add separator
pnpx shadcn@latest add dialog
pnpx shadcn@latest add dropdown-menu

# Loading states
pnpx shadcn@latest add skeleton
```

**Tasks:**
- [ ] Install all components
- [ ] Verify components render correctly
- [ ] Test dark mode toggle (Shadcn/ui has built-in support)
- [ ] Customize colors to match design system

**Component Locations:**
```
packages/ui/components/ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── tabs.tsx
├── tooltip.tsx
├── badge.tsx
├── separator.tsx
├── dialog.tsx
├── dropdown-menu.tsx
└── skeleton.tsx
```

**Verification:**
- All components importable
- Dark mode working
- Styles match design system

**Estimated Time:** 1 hour

---

### 1.3 Custom Component: FloatingIcon

**Goal:** Build floating icon xuất hiện khi bôi đen text

**Design Requirements:**
- Icon size: 32x32px (touch-friendly)
- Position: 8px above selection end
- Animation: Fade in (150ms), scale (0.95 → 1)
- Z-index: 999999 (above all page content)
- Color: Primary blue with white icon

**Implementation:**
```tsx
// packages/ui/components/custom/FloatingIcon.tsx
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingIconProps {
  position: { x: number; y: number }
  visible: boolean
  onClick: () => void
}

export const FloatingIcon: React.FC<FloatingIconProps> = ({
  position,
  visible,
  onClick,
}) => {
  return (
    <button
      className={cn(
        'fixed z-[999999] flex h-8 w-8 items-center justify-center',
        'rounded-full bg-primary-500 text-white shadow-lg',
        'transition-all duration-150 ease-out',
        'hover:scale-110 hover:bg-primary-600',
        'active:scale-95',
        visible
          ? 'pointer-events-auto scale-100 opacity-100'
          : 'pointer-events-none scale-95 opacity-0'
      )}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onClick={onClick}
      aria-label="Look up word"
    >
      <Search className="h-4 w-4" />
    </button>
  )
}
```

**Tasks:**
- [ ] Create FloatingIcon component
- [ ] Add animations (fade, scale)
- [ ] Test positioning logic
- [ ] Test on different screen sizes

**Verification:**
- Icon appears at correct position
- Animation smooth
- Hover/active states working

**Estimated Time:** 1.5 hours

---

### 1.4 Custom Component: DictionaryResult

**Goal:** Component hiển thị kết quả từ dictionary

**Layout Design:**
```
┌─────────────────────────────────────┐
│ dictionary                    [🔊]  │  ← Word + Audio button
│ /ˈdɪkʃəneri/                        │  ← Pronunciation
├─────────────────────────────────────┤
│ 📖 Translation                      │
│ từ điển                             │
├─────────────────────────────────────┤
│ 📝 Definition                       │
│ A book or electronic resource...   │
├─────────────────────────────────────┤
│ 💡 Examples                         │
│ • Look it up in the dictionary     │
│ • A medical dictionary              │
└─────────────────────────────────────┘
```

**Implementation:**
```tsx
// packages/ui/components/custom/DictionaryResult.tsx
import { Card, CardHeader, CardContent } from '@ui/components/ui/card'
import { Button } from '@ui/components/ui/button'
import { Badge } from '@ui/components/ui/badge'
import { Separator } from '@ui/components/ui/separator'
import { Volume2 } from 'lucide-react'

interface DictionaryResultProps {
  word: string
  pronunciation?: string
  translation?: string
  definition?: string
  examples?: string[]
  source: 'google' | 'bing' | 'cambridge'
  loading?: boolean
  onPlayAudio?: () => void
}

export const DictionaryResult: React.FC<DictionaryResultProps> = ({
  word,
  pronunciation,
  translation,
  definition,
  examples,
  source,
  loading,
  onPlayAudio,
}) => {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
              {word}
            </h3>
            {pronunciation && (
              <p className="mt-1 text-sm text-neutral-500">
                {pronunciation}
              </p>
            )}
          </div>
          {onPlayAudio && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onPlayAudio}
              aria-label="Play pronunciation"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Badge variant="secondary" className="mt-2 w-fit">
          {source}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {translation && (
          <div>
            <h4 className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
              📖 Translation
            </h4>
            <p className="text-base text-neutral-900 dark:text-neutral-50">
              {translation}
            </p>
          </div>
        )}

        {definition && (
          <>
            <Separator />
            <div>
              <h4 className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                📝 Definition
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {definition}
              </p>
            </div>
          </>
        )}

        {examples && examples.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                💡 Examples
              </h4>
              <ul className="space-y-1">
                {examples.map((example, index) => (
                  <li
                    key={index}
                    className="text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    • {example}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
```

**Tasks:**
- [ ] Create DictionaryResult component
- [ ] Add loading skeleton
- [ ] Add empty state
- [ ] Style theo design system

**Verification:**
- Component renders correctly
- Loading state smooth
- Responsive layout

**Estimated Time:** 2 hours

---

## 🔧 Phase 2: Core Logic Implementation (Day 2-3 - 12 hours)

### 2.1 Zustand Store Setup

**Goal:** Setup state management với Zustand + chrome.storage persistence

**Store 1: Dictionary Store**
```typescript
// packages/shared/stores/useDictionaryStore.ts
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { DictionaryResult } from '@shared/types/dictionary'

interface DictionaryState {
  currentWord: string
  results: {
    google?: DictionaryResult
    bing?: DictionaryResult
    cambridge?: DictionaryResult
  }
  loading: boolean
  error: string | null
  activeTab: 'google' | 'bing' | 'cambridge'

  // Actions
  searchWord: (word: string) => Promise<void>
  setActiveTab: (tab: 'google' | 'bing' | 'cambridge') => void
  clearResults: () => void
}

export const useDictionaryStore = create<DictionaryState>()(
  devtools(
    (set, get) => ({
      currentWord: '',
      results: {},
      loading: false,
      error: null,
      activeTab: 'google',

      searchWord: async (word: string) => {
        set({ loading: true, error: null, currentWord: word })
        
        try {
          // Fetch from all dictionaries in parallel
          const [google, bing, cambridge] = await Promise.allSettled([
            fetchGoogleTranslate(word),
            fetchBingTranslate(word),
            fetchCambridge(word),
          ])

          set({
            results: {
              google: google.status === 'fulfilled' ? google.value : undefined,
              bing: bing.status === 'fulfilled' ? bing.value : undefined,
              cambridge: cambridge.status === 'fulfilled' ? cambridge.value : undefined,
            },
            loading: false,
          })
        } catch (error) {
          set({ error: error.message, loading: false })
        }
      },

      setActiveTab: (tab) => set({ activeTab: tab }),
      clearResults: () => set({ results: {}, currentWord: '', error: null }),
    }),
    { name: 'dictionary-store' }
  )
)
```

**Store 2: Notebook Store**
```typescript
// packages/shared/stores/useNotebookStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { chromeStorage } from '@extension/storage'
import type { SavedWord } from '@shared/types/notebook'

interface NotebookState {
  words: SavedWord[]
  
  addWord: (word: Omit<SavedWord, 'id' | 'savedAt'>) => void
  removeWord: (id: string) => void
  searchWords: (query: string) => SavedWord[]
  hasWord: (word: string) => boolean
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
          words: state.words.filter((w) => w.id !== id),
        }))
      },

      searchWords: (query) => {
        const { words } = get()
        const lowerQuery = query.toLowerCase()
        return words.filter(
          (w) =>
            w.word.toLowerCase().includes(lowerQuery) ||
            w.translation?.toLowerCase().includes(lowerQuery)
        )
      },

      hasWord: (word) => {
        const { words } = get()
        return words.some((w) => w.word.toLowerCase() === word.toLowerCase())
      },
    }),
    {
      name: 'saladict-notebook',
      storage: createJSONStorage(() => chromeStorage),
    }
  )
)
```

**Store 3: History Store**
```typescript
// packages/shared/stores/useHistoryStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { chromeStorage } from '@extension/storage'
import type { HistoryEntry } from '@shared/types/history'

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
          // Remove duplicates (keep latest)
          const filtered = state.entries.filter((e) => e.word !== word)
          const newEntries = [newEntry, ...filtered]
          
          // Keep only last 100 entries
          return {
            entries: newEntries.slice(0, state.maxEntries),
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
    {
      name: 'saladict-history',
      storage: createJSONStorage(() => chromeStorage),
    }
  )
)
```

**Tasks:**
- [ ] Create all 3 stores
- [ ] Add TypeScript types
- [ ] Setup chrome.storage persistence
- [ ] Add DevTools integration
- [ ] Test stores in isolation

**Verification:**
- Stores accessible from components
- State persists across sessions
- DevTools show state changes

**Estimated Time:** 3 hours

---

### 2.2 Dictionary Engines Implementation

**Goal:** Implement 3 dictionary engines (Google, Bing, Cambridge)

**Engine 1: Google Translate (Priority 1)**
```typescript
// packages/shared/dictionaries/google/engine.ts
import axios from 'axios'
import type { DictionaryResult } from '@shared/types/dictionary'

export async function fetchGoogleTranslate(
  text: string,
  targetLang: string = 'vi'
): Promise<DictionaryResult> {
  try {
    // Using unofficial Google Translate API
    const response = await axios.get(
      'https://translate.googleapis.com/translate_a/single',
      {
        params: {
          client: 'gtx',
          sl: 'auto',
          tl: targetLang,
          dt: 't',
          q: text,
        },
        timeout: 5000,
      }
    )

    const translation = response.data[0]?.[0]?.[0]
    const detectedLang = response.data[2]

    if (!translation) {
      throw new Error('No translation found')
    }

    return {
      word: text,
      translation,
      source: 'google',
      detectedLanguage: detectedLang,
    }
  } catch (error) {
    console.error('[Google Translate] Error:', error)
    throw new Error(`Google Translate failed: ${error.message}`)
  }
}
```

**Engine 2: Bing Translator (Priority 2)**
```typescript
// packages/shared/dictionaries/bing/engine.ts
import axios from 'axios'
import type { DictionaryResult } from '@shared/types/dictionary'

export async function fetchBingTranslate(
  text: string,
  targetLang: string = 'vi'
): Promise<DictionaryResult> {
  try {
    // Using Bing Translator API (unofficial endpoint)
    const response = await axios.post(
      'https://www.bing.com/ttranslatev3',
      {
        fromLang: 'auto-detect',
        to: targetLang,
        text: text,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 5000,
      }
    )

    const translation = response.data[0]?.translations[0]?.text

    if (!translation) {
      throw new Error('No translation found')
    }

    return {
      word: text,
      translation,
      source: 'bing',
    }
  } catch (error) {
    console.error('[Bing Translate] Error:', error)
    throw new Error(`Bing Translate failed: ${error.message}`)
  }
}
```

**Engine 3: Cambridge Dictionary (Priority 3)**
```typescript
// packages/shared/dictionaries/cambridge/engine.ts
import axios from 'axios'
import * as cheerio from 'cheerio'
import type { DictionaryResult } from '@shared/types/dictionary'

export async function fetchCambridge(word: string): Promise<DictionaryResult> {
  try {
    // Web scraping approach
    const url = `https://dictionary.cambridge.org/dictionary/english/${word}`
    const response = await axios.get(url, { timeout: 5000 })

    const $ = cheerio.load(response.data)

    // Extract pronunciation
    const pronunciation = $('.ipa').first().text().trim()

    // Extract definition
    const definition = $('.def').first().text().trim()

    // Extract examples
    const examples: string[] = []
    $('.eg').each((i, el) => {
      if (i < 3) {
        // Limit to 3 examples
        examples.push($(el).text().trim())
      }
    })

    if (!definition) {
      throw new Error('No definition found')
    }

    return {
      word,
      pronunciation,
      definition,
      examples,
      source: 'cambridge',
    }
  } catch (error) {
    console.error('[Cambridge] Error:', error)
    throw new Error(`Cambridge Dictionary failed: ${error.message}`)
  }
}
```

**Tasks:**
- [ ] Implement Google Translate engine
- [ ] Implement Bing Translator engine
- [ ] Implement Cambridge Dictionary engine (web scraping)
- [ ] Add error handling + retry logic (3 attempts)
- [ ] Add timeout (5s per request)
- [ ] Test với nhiều ngôn ngữ (en→vi, vi→en, ja→vi)

**Verification:**
- All engines return correct data
- Error handling robust
- Performance acceptable (<5s total)

**Estimated Time:** 4 hours

---

### 2.3 Audio Pronunciation

**Goal:** Implement phát âm từ vựng với Web Speech API

**Implementation:**
```typescript
// packages/shared/utils/audio.ts
export class AudioPlayer {
  private synth = window.speechSynthesis
  private currentUtterance: SpeechSynthesisUtterance | null = null

  async playText(text: string, lang: string = 'en-US'): Promise<void> {
    // Cancel any ongoing speech
    this.stop()

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = 0.85 // Slightly slower for clarity
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onend = () => {
        this.currentUtterance = null
        resolve()
      }

      utterance.onerror = (event) => {
        this.currentUtterance = null
        reject(new Error(`Speech synthesis failed: ${event.error}`))
      }

      this.currentUtterance = utterance
      this.synth.speak(utterance)
    })
  }

  stop(): void {
    if (this.currentUtterance) {
      this.synth.cancel()
      this.currentUtterance = null
    }
  }

  isPlaying(): boolean {
    return this.synth.speaking
  }
}

// Singleton instance
export const audioPlayer = new AudioPlayer()

// Language detection helper
export function detectLanguage(text: string): string {
  // Simple heuristic: check for Vietnamese characters
  const vietnameseRegex = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i
  
  if (vietnameseRegex.test(text)) {
    return 'vi-VN'
  }
  
  // Default to English
  return 'en-US'
}
```

**Tasks:**
- [ ] Implement AudioPlayer class
- [ ] Add language detection
- [ ] Add error handling (fallback if Web Speech API not available)
- [ ] Test pronunciation accuracy

**Verification:**
- Audio plays correctly
- Language detection accurate
- No memory leaks

**Estimated Time:** 2 hours

---

### 2.4 Text Selection Detection

**Goal:** Detect khi user bôi đen text trên trang web

**Implementation:**
```typescript
// pages/content/src/matches/all/SelectionDetector.ts
export class SelectionDetector {
  private selectionTimeout: NodeJS.Timeout | null = null
  private lastSelection: string = ''

  constructor(
    private onSelectionChange: (text: string, rect: DOMRect) => void
  ) {
    this.init()
  }

  private init(): void {
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('selectionchange', this.handleSelectionChange)
  }

  private handleMouseUp = (): void => {
    // Small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()

      if (text && text.length > 0 && text !== this.lastSelection) {
        this.lastSelection = text
        
        const range = selection!.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        
        this.onSelectionChange(text, rect)
      }
    }, 50)
  }

  private handleSelectionChange = (): void => {
    // Debounce to avoid excessive triggers
    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout)
    }

    this.selectionTimeout = setTimeout(() => {
      const selection = window.getSelection()
      const text = selection?.toString().trim()

      // Clear if no selection
      if (!text || text.length === 0) {
        this.lastSelection = ''
      }
    }, 300)
  }

  destroy(): void {
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('selectionchange', this.handleSelectionChange)
    
    if (this.selectionTimeout) {
      clearTimeout(this.selectionTimeout)
    }
  }
}
```

**Position Calculator:**
```typescript
// packages/shared/utils/position.ts
export interface Position {
  x: number
  y: number
}

export function calculateFloatingIconPosition(rect: DOMRect): Position {
  const iconWidth = 32
  const iconHeight = 32
  const offset = 8

  // Position above selection, centered horizontally
  let x = rect.left + rect.width / 2 - iconWidth / 2
  let y = rect.top - iconHeight - offset

  // Adjust if icon would be off-screen
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Horizontal bounds
  if (x < 10) x = 10
  if (x + iconWidth > viewportWidth - 10) {
    x = viewportWidth - iconWidth - 10
  }

  // Vertical bounds (if selection is at top, show below)
  if (y < 10) {
    y = rect.bottom + offset
  }

  // Account for scroll position
  x += window.scrollX
  y += window.scrollY

  return { x, y }
}
```

**Tasks:**
- [ ] Implement SelectionDetector class
- [ ] Implement position calculator
- [ ] Handle edge cases (iframe, shadow DOM)
- [ ] Test on various websites (Wikipedia, Medium, Gmail)

**Verification:**
- Selection detected accurately
- Position calculated correctly
- No performance issues

**Estimated Time:** 3 hours

---

## 🔗 Phase 3: Integration & Pages (Day 4-5 - 12 hours)

### 3.1 Content Script Integration

**Goal:** Integrate selection detection + floating icon vào content script

**Implementation:**
```typescript
// pages/content-ui/src/matches/all/index.tsx
import { createRoot } from 'react-dom/client'
import { SelectionDetector } from './SelectionDetector'
import { FloatingIcon } from '@ui/components/custom/FloatingIcon'
import { calculateFloatingIconPosition } from '@shared/utils/position'

// Create container for floating icon
const container = document.createElement('div')
container.id = 'saladict-floating-icon-root'
container.style.cssText = 'all: initial; position: absolute; z-index: 999999;'
document.body.appendChild(container)

const root = createRoot(container)

// State
let currentPosition = { x: 0, y: 0 }
let currentText = ''
let isVisible = false

// Render function
function render() {
  root.render(
    <FloatingIcon
      position={currentPosition}
      visible={isVisible}
      onClick={handleIconClick}
    />
  )
}

// Selection handler
const detector = new SelectionDetector((text, rect) => {
  currentText = text
  currentPosition = calculateFloatingIconPosition(rect)
  isVisible = true
  render()
})

// Icon click handler
function handleIconClick() {
  // Send message to background to open popup
  chrome.runtime.sendMessage({
    type: 'OPEN_POPUP',
    payload: { word: currentText },
  })
  
  // Hide icon
  isVisible = false
  render()
}

// Hide icon when clicking outside
document.addEventListener('mousedown', (e) => {
  const target = e.target as HTMLElement
  if (!target.closest('#saladict-floating-icon-root')) {
    isVisible = false
    render()
  }
})

// Initial render
render()

console.log('[Saladict] Content UI loaded')
```

**Tasks:**
- [ ] Integrate SelectionDetector
- [ ] Integrate FloatingIcon
- [ ] Add message passing to background
- [ ] Handle cleanup on page navigation
- [ ] Test on various websites

**Verification:**
- Icon appears on text selection
- Icon disappears on deselection
- Click opens popup
- No memory leaks

**Estimated Time:** 3 hours

---

### 3.2 Background Service Worker

**Goal:** Setup message passing và coordination

**Implementation:**
```typescript
// chrome-extension/src/background/index.ts
import 'webextension-polyfill'

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Background] Received message:', message)

  switch (message.type) {
    case 'OPEN_POPUP':
      handleOpenPopup(message.payload, sender.tab?.id)
      break

    case 'SEARCH_WORD':
      handleSearchWord(message.payload).then(sendResponse)
      return true // Async response

    default:
      console.warn('[Background] Unknown message type:', message.type)
  }
})

async function handleOpenPopup(
  payload: { word: string },
  tabId?: number
): Promise<void> {
  try {
    // Store word in chrome.storage for popup to read
    await chrome.storage.local.set({ pendingWord: payload.word })

    // Open popup (or side panel in future)
    await chrome.action.openPopup()
  } catch (error) {
    console.error('[Background] Failed to open popup:', error)
  }
}

async function handleSearchWord(payload: { word: string }) {
  // This can be used for background fetching if needed
  // For now, fetching happens in popup directly
  return { success: true }
}

console.log('[Saladict] Background service worker loaded')
```

**Tasks:**
- [ ] Implement message handlers
- [ ] Add error handling
- [ ] Test message passing
- [ ] Verify popup opens correctly

**Verification:**
- Messages sent/received correctly
- Popup opens with selected word
- No errors in console

**Estimated Time:** 2 hours

---

### 3.3 Popup Page Implementation

**Goal:** Build main popup UI với dictionary results

**Layout:**
```
┌─────────────────────────────────────┐
│ 🔍 [Search Input]          [⚙️] [✕] │  ← Header
├─────────────────────────────────────┤
│ 📖 Google | Bing | Cambridge        │  ← Tabs
├─────────────────────────────────────┤
│                                     │
│  [Dictionary Result Content]        │  ← Main content
│  - Pronunciation                    │
│  - Translation/Definition           │
│  - Examples                         │
│                                     │
├─────────────────────────────────────┤
│ [🔊 Audio] [⭐ Save] [📋 History]   │  ← Actions
└─────────────────────────────────────┘
```

**Implementation:**
```tsx
// pages/popup/src/Popup.tsx
import { useEffect, useState } from 'react'
import { Input } from '@ui/components/ui/input'
import { Button } from '@ui/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/components/ui/tabs'
import { DictionaryResult } from '@ui/components/custom/DictionaryResult'
import { useDictionaryStore } from '@shared/stores/useDictionaryStore'
import { useNotebookStore } from '@shared/stores/useNotebookStore'
import { useHistoryStore } from '@shared/stores/useHistoryStore'
import { audioPlayer, detectLanguage } from '@shared/utils/audio'
import { Settings, X, Volume2, Star, History } from 'lucide-react'

export default function Popup() {
  const {
    currentWord,
    results,
    loading,
    error,
    activeTab,
    searchWord,
    setActiveTab,
  } = useDictionaryStore()

  const { addWord, hasWord } = useNotebookStore()
  const { addEntry } = useHistoryStore()

  const [searchInput, setSearchInput] = useState('')

  // Load pending word from background
  useEffect(() => {
    chrome.storage.local.get('pendingWord').then(({ pendingWord }) => {
      if (pendingWord) {
        setSearchInput(pendingWord)
        searchWord(pendingWord)
        addEntry(pendingWord)
        chrome.storage.local.remove('pendingWord')
      }
    })
  }, [])

  const handleSearch = () => {
    if (searchInput.trim()) {
      searchWord(searchInput.trim())
      addEntry(searchInput.trim())
    }
  }

  const handlePlayAudio = async () => {
    if (currentWord) {
      const lang = detectLanguage(currentWord)
      await audioPlayer.playText(currentWord, lang)
    }
  }

  const handleSaveToNotebook = () => {
    const result = results[activeTab]
    if (result) {
      addWord({
        word: currentWord,
        translation: result.translation,
        pronunciation: result.pronunciation,
        source: activeTab,
      })
    }
  }

  const isSaved = hasWord(currentWord)

  return (
    <div className="flex h-[600px] w-[400px] flex-col bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-neutral-200 p-4 dark:border-neutral-800">
        <Input
          type="text"
          placeholder="Search word..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      {currentWord && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="bing">Bing</TabsTrigger>
            <TabsTrigger value="cambridge">Cambridge</TabsTrigger>
          </TabsList>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading && <div>Loading...</div>}
            
            {error && (
              <div className="text-sm text-error">{error}</div>
            )}

            {!loading && !error && (
              <>
                <TabsContent value="google">
                  {results.google ? (
                    <DictionaryResult
                      {...results.google}
                      onPlayAudio={handlePlayAudio}
                    />
                  ) : (
                    <div>No results from Google</div>
                  )}
                </TabsContent>

                <TabsContent value="bing">
                  {results.bing ? (
                    <DictionaryResult
                      {...results.bing}
                      onPlayAudio={handlePlayAudio}
                    />
                  ) : (
                    <div>No results from Bing</div>
                  )}
                </TabsContent>

                <TabsContent value="cambridge">
                  {results.cambridge ? (
                    <DictionaryResult
                      {...results.cambridge}
                      onPlayAudio={handlePlayAudio}
                    />
                  ) : (
                    <div>No results from Cambridge</div>
                  )}
                </TabsContent>
              </>
            )}
          </div>

          {/* Actions */}
          {currentWord && !loading && (
            <div className="flex items-center gap-2 border-t border-neutral-200 p-4 dark:border-neutral-800">
              <Button variant="outline" size="sm" onClick={handlePlayAudio}>
                <Volume2 className="mr-2 h-4 w-4" />
                Audio
              </Button>
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="sm"
                onClick={handleSaveToNotebook}
                disabled={isSaved}
              >
                <Star className="mr-2 h-4 w-4" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" size="sm">
                <History className="mr-2 h-4 w-4" />
                History
              </Button>
            </div>
          )}
        </Tabs>
      )}
    </div>
  )
}
```

**Tasks:**
- [ ] Implement Popup component
- [ ] Connect to stores
- [ ] Add search functionality
- [ ] Add tab switching
- [ ] Add action buttons (audio, save, history)
- [ ] Style theo design system

**Verification:**
- Popup opens with selected word
- Search working
- Tab switching smooth
- Save to notebook working
- Audio playing

**Estimated Time:** 4 hours

---

### 3.4 Options Page (Settings)

**Goal:** Build settings page cho extension

**Settings to Include:**
- Target language (vi, en, ja, etc.)
- Default dictionary (Google, Bing, Cambridge)
- Enable/disable auto-pronunciation
- Theme (light, dark, auto)

**Implementation:**
```tsx
// pages/options/src/Options.tsx
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@ui/components/ui/card'
import { Label } from '@ui/components/ui/label'
import { Select } from '@ui/components/ui/select'
import { Switch } from '@ui/components/ui/switch'

export default function Options() {
  const [settings, setSettings] = useState({
    targetLanguage: 'vi',
    defaultDictionary: 'google',
    autoPronunciation: false,
    theme: 'auto',
  })

  const handleSave = async () => {
    await chrome.storage.local.set({ settings })
    // Show toast notification
  }

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Saladict Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Language Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Target Language</Label>
              <Select
                value={settings.targetLanguage}
                onValueChange={(value) =>
                  setSettings({ ...settings, targetLanguage: value })
                }
              >
                <option value="vi">Vietnamese</option>
                <option value="en">English</option>
                <option value="ja">Japanese</option>
              </Select>
            </div>

            <div>
              <Label>Default Dictionary</Label>
              <Select
                value={settings.defaultDictionary}
                onValueChange={(value) =>
                  setSettings({ ...settings, defaultDictionary: value })
                }
              >
                <option value="google">Google Translate</option>
                <option value="bing">Bing Translator</option>
                <option value="cambridge">Cambridge Dictionary</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Auto-play pronunciation</Label>
              <Switch
                checked={settings.autoPronunciation}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoPronunciation: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  )
}
```

**Tasks:**
- [ ] Implement Options page
- [ ] Add settings form
- [ ] Save to chrome.storage
- [ ] Add validation

**Verification:**
- Settings save correctly
- Settings persist across sessions

**Estimated Time:** 2 hours

---

### 3.5 Notebook Page

**Goal:** Build notebook page để xem từ đã lưu

**Implementation:** (Similar to plan reference, using WordCard component)

**Estimated Time:** 1 hour

---

## 🚀 Phase 4: Polish & Testing (Day 6-7 - 8 hours)

### 4.1 Performance Optimization

**Tasks:**
- [ ] Lazy load dictionary engines
- [ ] Debounce search input (300ms)
- [ ] Optimize re-renders (React.memo)
- [ ] Code splitting (dynamic imports)
- [ ] Measure bundle size

**Verification:**
- Popup opens <100ms
- Search results <5s
- Bundle size <1MB

**Estimated Time:** 2 hours

---

### 4.2 Error Handling & Edge Cases

**Tasks:**
- [ ] Add error boundaries
- [ ] Add retry logic (3 attempts)
- [ ] Add offline detection
- [ ] Handle storage quota exceeded
- [ ] User-friendly error messages

**Verification:**
- No crashes
- Error messages clear
- Graceful degradation

**Estimated Time:** 2 hours

---

### 4.3 Accessibility (A11y)

**Tasks:**
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] ARIA labels
- [ ] Focus management
- [ ] Color contrast check (WCAG AA)

**Verification:**
- Keyboard navigation working
- Color contrast ≥4.5:1

**Estimated Time:** 2 hours

---

### 4.4 Testing

**Tasks:**
- [ ] Manual testing on 10+ websites
- [ ] Test all dictionary engines
- [ ] Test save/history features
- [ ] Test dark mode
- [ ] Test edge cases

**Verification:**
- All features working
- No critical bugs

**Estimated Time:** 2 hours

---

## 📦 Phase 5: Build & Deployment (Day 7 - 2 hours)

### 5.1 Production Build

**Tasks:**
- [ ] Update manifest (name, description, version)
- [ ] Optimize assets
- [ ] Build: `pnpm build`
- [ ] Test production build

**Verification:**
- Build successful
- Extension loads in Chrome
- All features working

**Estimated Time:** 1 hour

---

### 5.2 Documentation

**Tasks:**
- [ ] Update README.md
- [ ] Add screenshots
- [ ] Write user guide
- [ ] Document development setup

**Estimated Time:** 1 hour

---

## 📊 Summary

### Total Estimated Time: **42 hours** (1 week with AI assistance)

### Phase Breakdown:
- **Phase 0:** Pre-Development Setup (2h)
- **Phase 1:** UI Foundation (6h)
- **Phase 2:** Core Logic (12h)
- **Phase 3:** Integration & Pages (12h)
- **Phase 4:** Polish & Testing (8h)
- **Phase 5:** Build & Deployment (2h)

### Daily Schedule (AI-assisted):
- **Day 0 (2h):** Setup dependencies, project structure
- **Day 1 (6h):** Design system + Shadcn/ui + Custom components
- **Day 2 (6h):** Zustand stores + Dictionary engines
- **Day 3 (6h):** Audio + Selection detection
- **Day 4 (6h):** Content script + Background + Popup
- **Day 5 (6h):** Options + Notebook + History pages
- **Day 6 (4h):** Performance + Error handling + A11y
- **Day 7 (4h):** Testing + Build + Documentation

### Key Milestones:
1. ✅ **Day 0-1:** Setup + UI components ready
2. ✅ **Day 2-3:** Core logic working (stores + engines + audio)
3. ✅ **Day 4-5:** Full integration (selection → popup → save)
4. ✅ **Day 6-7:** Polish + Production build

---

## 🎯 Next Steps

**Ready to start?** 

1. **Confirm this plan** - Bạn có muốn adjust gì không?
2. **Start Phase 0** - Setup dependencies và project structure
3. **Follow daily schedule** - Tôi sẽ guide từng bước

**Lưu ý:**
- Timeline 1 tuần là aggressive, cần focus full-time
- AI sẽ giúp generate code nhanh, nhưng cần review kỹ
- Ưu tiên core features trước, polish sau
- Test thường xuyên để catch bugs sớm

**Bạn muốn bắt đầu ngay không?** 🚀
