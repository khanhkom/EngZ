# PRD & Implementation Plan: EngZ Backend (Features)

**Status**: Draft
**Date**: 2026-01-29
**Author**: Antigravity (Project Planner)
**Version**: 1.0

---

## 1. Project Overview

**EngZ Backend** is the centralized server designed to synchronize data between the EngZ Chrome Extension and the new Mobile App.
The "Base" (NestJS + PostgreSQL) is already established. This plan focuses on implementing the core functional features required to support the applications.

**Core Objectives:**
1.  **Data Synchronization**: Ensure Notebook (Vocabulary) and Search History are consistent across devices.
2.  **API Performance**: Provide low-latency endpoints for real-time lookups (if needed) and syncing.
3.  **Reliability**: Secure storage of user learning data.

## 2. Technical Stack (Confirmed)

*   **Framework**: NestJS
*   **Database**: PostgreSQL
*   **ORM**: TypeORM or Prisma (To be confirmed during implementation, assuming standard NestJS patterns).
*   **Auth**: Existing Auth System (JWT based).

## 3. Functional Requirements (Feature List)

### 3.1. Notebook Management (Core)
Users save vocabulary (words, phrases) to their personal notebook.
*   **Create**: specific word with metadata (translation, context, source).
*   **Read**: List all words, filter by date/tags, search within notebook.
*   **Update**: Edit notes, update mastery level (e.g., "Learned", "Reviewing").
*   **Delete**: Remove words.

### 3.2. History Tracking
Automatically logs words searched by the user.
*   **Log Search**: Fire-and-forget endpoint when a user searches a word.
*   **Fetch History**: Get recent searches (paginated).
*   **Clear History**: Delete specific items or clear all.

### 3.3. Synchronization Logic
*   **Strategy**: "Last Write Wins" (MVP) or "Merkle Tree/Timestamp" (Advanced).
*   *Proposal*: Use a `last_updated_at` timestamp for all entities. Client sends `last_sync_timestamp`, Server returns records modified after that time.

## 4. Database Schema Design (Proposed)

### 4.1. Entity: `NotebookEntry`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `userId` | UUID | Foreign Key to User |
| `word` | String | The vocabulary term |
| `translation` | Text | User's translation or auto-definition |
| `context` | Text | Sentence where word was found |
| `source` | String | URL or Dictionary Name |
| `status` | Enum | `NEW`, `LEARNING`, `MASTERED` |
| `createdAt` | Timestamp | |
| `updatedAt` | Timestamp | Used for Sync |

### 4.2. Entity: `SearchHistory`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | PK |
| `userId` | UUID | FK |
| `query` | String | The searched term |
| `provider` | String | e.g. "Cambridge", "Google" |
| `searchedAt` | Timestamp | |

## 5. API Design (Routes)

### 5.1. Notebook (`/api/notebook`)
*   `GET /`: Get all entries (supports `?since=TIMESTAMP` for sync).
*   `POST /`: Add new entry.
*   `PATCH /:id`: Update entry.
*   `DELETE /:id`: Soft delete (mark as deleted) or Hard delete.

### 5.2. History (`/api/history`)
*   `GET /`: Get recent history.
*   `POST /`: Log a search.
*   `DELETE /`: Clear history.

## 6. Implementation Plan

### Phase 1: Environment & connection
*   [ ] **Task 1.1**: Verify NestJS project structure and running status.
*   [ ] **Task 1.2**: Configure PostgreSQL connection string in `.env`.
*   [ ] **Task 1.3**: Setup Database Migration tool (TypeORM/Prisma).

### Phase 2: Notebook Feature
*   [ ] **Task 2.1**: **Schema**: Create `NotebookEntry` entity/table.
*   [ ] **Task 2.2**: **DTOs**: Define Validation DTOs (CreateNotebookEntryDto, Update...).
*   [ ] **Task 2.3**: **Service**: Implement CRUD logic.
*   [ ] **Task 2.4**: **Controller**: Expose Endpoints protected by Auth Guard.

### Phase 3: History Feature
*   [ ] **Task 3.1**: **Schema**: Create `SearchHistory` entity.
*   [ ] **Task 3.2**: **Service**: Implement logging logic (async optimized).
*   [ ] **Task 3.3**: **Controller**: Expose Endpoints.

### Phase 4: Sync & Integration
*   [ ] **Task 4.1**: Implement `GET /sync` (or modify GET /notebook) to handle delta updates.
*   [ ] **Task 4.2**: Test payloads with Postman/Insomnia.
*   [ ] **Task 4.3**: Document API (Swagger/OpenAPI).

## 7. Verification Checklist
*   [ ] **Schema**: Can we migrate up/down without data loss?
*   [ ] **Auth**: Are endpoints correctly rejecting unauthenticated requests?
*   [ ] **Sync**: Does fetching with `?since=` return only new items?
*   [ ] **Performance**: Is History logging non-blocking?

## 8. Next Steps
1.  **Review**: confirm this feature set.
2.  **Execute**: Start with Phase 1 (Environment setup).
