import { notebookApi, isApiError } from '../api/index.js';
import { notebookStorage, authStorage } from '@extension/storage';
import type { ApiNotebookEntry, CreateNotebookEntryRequest } from '../api/index.js';
import type { SavedWord, NotebookEntryStatus } from '@extension/storage';

interface SyncStats {
  pushed: number;
  pulled: number;
  deleted: number;
  errors: number;
}

/**
 * Convert local SavedWord to API create request format
 */
const toApiEntry = (word: SavedWord): CreateNotebookEntryRequest => ({
  word: word.word,
  translation: word.translation || '',
  source: word.source,
  status: word.status,
});

/**
 * Convert API entry to local SavedWord format
 */
const toLocalWord = (entry: ApiNotebookEntry, existing?: SavedWord): SavedWord => ({
  id: existing?.id || crypto.randomUUID(),
  serverId: entry.id,
  word: entry.word,
  translation: entry.translation,
  // Preserve local-only fields from existing entry
  pronunciation: existing?.pronunciation,
  definition: existing?.definition,
  examples: existing?.examples,
  source: (entry.source as SavedWord['source']) || 'google',
  status: entry.status as NotebookEntryStatus,
  savedAt: new Date(entry.createdAt).getTime(),
  updatedAt: new Date(entry.updatedAt).getTime(),
  deletedAt: entry.deletedAt ? new Date(entry.deletedAt).getTime() : undefined,
  syncStatus: 'synced',
});

class NotebookSyncService {
  private isSyncing = false;

  /**
   * Perform a full sync: push pending changes, then pull server changes
   */
  async sync(): Promise<SyncStats> {
    if (this.isSyncing) {
      console.log('[NotebookSync] Sync already in progress');
      return { pushed: 0, pulled: 0, deleted: 0, errors: 0 };
    }

    // Check if user is authenticated
    const authState = await authStorage.get();
    if (!authState.isAuthenticated) {
      console.log('[NotebookSync] Not authenticated, skipping sync');
      return { pushed: 0, pulled: 0, deleted: 0, errors: 0 };
    }

    this.isSyncing = true;
    const stats: SyncStats = { pushed: 0, pulled: 0, deleted: 0, errors: 0 };

    try {
      // 1. Push pending local changes first
      const pushStats = await this.pushPendingChanges();
      stats.pushed = pushStats.pushed;
      stats.errors = pushStats.errors;

      // 2. Pull server changes
      const pullStats = await this.pullServerChanges();
      stats.pulled = pullStats.pulled;
      stats.deleted = pullStats.deleted;
      stats.errors += pullStats.errors;

      // 3. Update last sync timestamp
      await authStorage.setLastSyncAt(new Date().toISOString());

      console.log('[NotebookSync] Sync complete:', stats);
      return stats;
    } catch (error) {
      console.error('[NotebookSync] Sync failed:', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Push all pending local changes to the server
   */
  private async pushPendingChanges(): Promise<{ pushed: number; errors: number }> {
    const pending = await notebookStorage.getPendingWords();
    let pushed = 0;
    let errors = 0;

    for (const word of pending) {
      try {
        if (word.syncStatus === 'pending_create') {
          // Create new entry on server
          const response = await notebookApi.create(toApiEntry(word));
          await notebookStorage.markSynced(word.id, response.data.id);
          pushed++;
        } else if (word.syncStatus === 'pending_update' && word.serverId) {
          // Update existing entry on server
          await notebookApi.update(word.serverId, {
            translation: word.translation,
            status: word.status,
          });
          await notebookStorage.markSynced(word.id);
          pushed++;
        } else if (word.syncStatus === 'pending_delete' && word.serverId) {
          // Delete entry on server
          await notebookApi.delete(word.serverId);
          // Remove from local storage completely
          await notebookStorage.removeWord(word.id);
          pushed++;
        } else if (word.syncStatus === 'pending_delete' && !word.serverId) {
          // Word was never synced, just remove locally
          await notebookStorage.removeWord(word.id);
          pushed++;
        }
      } catch (error) {
        console.error(`[NotebookSync] Failed to push word ${word.id}:`, error);

        // If it's a 404 or 409, the entry might have been deleted/modified on server
        // In that case, we might want to handle it differently
        if (isApiError(error)) {
          if (error.isNotFound && word.syncStatus === 'pending_update') {
            // Entry was deleted on server, remove locally
            await notebookStorage.removeWord(word.id);
          } else if (error.isConflict && word.syncStatus === 'pending_create') {
            // Word already exists on server, mark as synced
            // Next pull will get the server version
            await notebookStorage.markSynced(word.id);
          }
        }

        errors++;
      }
    }

    return { pushed, errors };
  }

  /**
   * Pull changes from server since last sync
   */
  private async pullServerChanges(): Promise<{ pulled: number; deleted: number; errors: number }> {
    let pulled = 0;
    let deleted = 0;
    let errors = 0;

    try {
      const lastSyncAt = await authStorage.getLastSyncAt();

      // Fetch all changes since last sync
      const response = await notebookApi.list({
        since: lastSyncAt || undefined,
        includeDeleted: true,
        perPage: 100, // Get up to 100 entries per page
      });

      const serverEntries = response.data;
      const state = await notebookStorage.get();

      // Build a map of local words by serverId for quick lookup
      const localByServerId = new Map<string, SavedWord>();
      const localByWord = new Map<string, SavedWord>();

      for (const word of state.words) {
        if (word.serverId) {
          localByServerId.set(word.serverId, word);
        }
        localByWord.set(word.word.toLowerCase(), word);
      }

      // Process each server entry
      for (const serverEntry of serverEntries) {
        try {
          const existingByServerId = localByServerId.get(serverEntry.id);
          const existingByWord = localByWord.get(serverEntry.word.toLowerCase());
          const existing = existingByServerId || existingByWord;

          if (serverEntry.deletedAt) {
            // Entry was deleted on server
            if (existing && !existing.deletedAt) {
              await notebookStorage.removeWord(existing.id);
              deleted++;
            }
          } else if (existing) {
            // Update existing entry if server version is newer
            const serverUpdated = new Date(serverEntry.updatedAt).getTime();
            if (serverUpdated > existing.updatedAt && existing.syncStatus === 'synced') {
              const updatedWord = toLocalWord(serverEntry, existing);
              await notebookStorage.addWordFromSync(updatedWord);
              pulled++;
            }
          } else {
            // New entry from server
            const newWord = toLocalWord(serverEntry);
            await notebookStorage.addWordFromSync(newWord);
            pulled++;
          }
        } catch (error) {
          console.error(`[NotebookSync] Failed to process server entry ${serverEntry.id}:`, error);
          errors++;
        }
      }

      // Handle pagination if there are more entries
      if (response.metadata.hasNext) {
        console.log('[NotebookSync] More entries available, consider implementing pagination');
      }
    } catch (error) {
      console.error('[NotebookSync] Failed to pull server changes:', error);
      errors++;
    }

    return { pulled, deleted, errors };
  }

  /**
   * Perform initial bulk sync for new users
   * Uploads all local words to server
   */
  async bulkPush(): Promise<{ created: number; skipped: number }> {
    const activeWords = await notebookStorage.getActiveWords();
    const unsyncedWords = activeWords.filter(w => !w.serverId);

    if (unsyncedWords.length === 0) {
      return { created: 0, skipped: 0 };
    }

    try {
      const entries = unsyncedWords.map(toApiEntry);
      const response = await notebookApi.bulkCreate({ entries });

      // Update local words with server IDs
      for (const result of response.data.entries) {
        if (result.status === 'created') {
          const localWord = unsyncedWords.find(w => w.word.toLowerCase() === result.word.toLowerCase());
          if (localWord) {
            await notebookStorage.markSynced(localWord.id, result.id);
          }
        }
      }

      return {
        created: response.data.created,
        skipped: response.data.skipped,
      };
    } catch (error) {
      console.error('[NotebookSync] Bulk push failed:', error);
      throw error;
    }
  }

  /**
   * Check if sync is currently in progress
   */
  get syncing(): boolean {
    return this.isSyncing;
  }
}

const notebookSyncService = new NotebookSyncService();

export type { SyncStats };
export { notebookSyncService };
