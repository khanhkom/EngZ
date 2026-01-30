# PRD & Implementation Plan: EngZ Mobile App

**Status**: Draft
**Date**: 2026-01-28
**Author**: Antigravity (Project Planner)
**Version**: 1.0

---

## 1. Project Overview

**EngZ Mobile** is a React Native mobile application designed to extend the capabilities of the EngZ Chrome Extension to iOS and Android devices. It serves as a personal learning companion, allowing users to look up vocabulary across multiple dictionaries, save words to a personal notebook, and review their search history.

**Key Philosophy:**
- **Consistency**: Visual and functional parity with the Chrome Extension.
- **Mobile-First**: Optimized UX for touch interactions and mobile usage patterns.
- **Scalable**: Built for local-first usage initially, with architecture ready for future Cloud Sync.

## 2. Functional Requirements

### 2.1. Core Features (MVP)
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F01 | **Multi-Source Search** | Search vocabulary using Google, Bing, and Cambridge dictionaries. Results are displayed in tabs. | P0 |
| F02 | **Notebook** | Save words with translation, pronunciation, examples, and source. Edit and delete saved words. | P0 |
| F03 | **History** | Automatically log searched terms. View and clear history. | P1 |
| F04 | **Audio Pronunciation** | Auto-play or manual play of pronunciation audio from dictionary sources. | P1 |
| F05 | **Settings** | Configure Target Language, Default Dictionary, Auto-pronouncation, and Theme (Dark/Light). | P2 |

### 2.2. User Flow (Mobile Specific)
1.  **Splash Screen**: App branding.
2.  **Home/Search Screen**: Large search bar. Quick access to recent history/notebook.
3.  **Search Result Screen**: Tabbed view for different dictionary sources (Google, Bing, Cambridge). Floating "Save to Notebook" button.
4.  **Notebook Screen**: List of saved words. Tap to view details. Swipe to delete.
5.  **Settings Screen**: Preferences configuration.

## 3. Technical Architecture

### 3.1. Tech Stack
*   **Framework**: React Native CLI (0.76+)
*   **Language**: TypeScript
*   **Navigation**: React Navigation v7 (Native Stack + Bottom Tabs)
*   **State Management**: Zustand (consistent with Web Extension)
*   **Local Storage**: `react-native-mmkv` (Fast, synchronous storage replacing LocalStorage)
*   **Styling**: `NativeWind` (TailwindCSS for RN) or `StyleSheet` (Standard). *Recommendation: NativeWind for code sharing potential with Web.*
*   **Icons**: `lucide-react-native`
*   **Network**: `fetch` / `axios` (Reusing Logic from Extension if possible)

### 3.2. Code Sharing Strategy (Monorepo)
Since this is inside a TurboRepo, we will create a new app package `apps/mobile`.
*   **Shared Logic**: Reuse `@extension/shared` (types, hooks, constants) where possible.
    *   *Note*: Some hooks in `@extension/shared` might need refactoring if they depend on Chrome APIs. We will create "universal" hooks or mock Chrome APIs for mobile.

## 4. Implementation Plan

### Phase 1: Foundation & Setup
- [ ] **Task 1.1**: Initialize React Native CLI project in `apps/mobile`.
- [ ] **Task 1.2**: Configure Metro Bundler to work with TurboRepo (hoisting).
- [ ] **Task 1.3**: Setup Navigation (Bottom Tab: Search, Notebook, History, Settings).
- [ ] **Task 1.4**: Setup UI Kit (NativeWind or basic components similar to Extension UI).

### Phase 2: Core Search Feature
- [ ] **Task 2.1**: Implement Search Screen with Input field.
- [ ] **Task 2.2**: Port Dictionary Services (Google, Bing, Cambridge) from Extension.
    *   *Challenge*: Chrome Extension avoids CORS via Background Script. Mobile App allows direct network requests but we must ensure APIs don't block mobile user agents.
- [ ] **Task 2.3**: Build Result Detail Screen with Tabs for each source.
- [ ] **Task 2.4**: Implement Audio Player (`react-native-sound` or `expo-av` if using unimodules, or purely native).

### Phase 3: Data Persistence (Notebook & History)
- [ ] **Task 3.1**: Setup `mmkv` storage adapters to replace Chrome Storage.
- [ ] **Task 3.2**: Implement `useNotebookStore` and `useHistoryStore` compatible with Mobile.
- [ ] **Task 3.3**: Build Notebook List UI (Swipe to delete).
- [ ] **Task 3.4**: Build History List UI.

### Phase 4: Settings & Polish
- [ ] **Task 4.1**: Implement Settings Screen (Language, Defaults).
- [ ] **Task 4.2**: Theming (Light/Dark mode support).
- [ ] **Task 4.3**: App Icon and Splash Screen.

## 5. Verification Checklist

### Quality Assurance
- [ ] **Functional**: Can search "hello" and get results from all 3 sources?
- [ ] **Persistence**: Restart app -> Is Notebook/History preserved?
- [ ] **Performance**: List scrolling is 60fps? Search latency < 2s?
- [ ] **UI/UX**: Does it match the EngZ aesthetic (Blue/White clean look)?

---

## 6. Next Steps
1.  **Approval**: Review this plan.
2.  **Execution**: Run `/create` or start manually by initializing the mobile app folder.
