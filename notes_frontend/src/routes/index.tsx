import { component$, useStore, useStylesScoped$, useTask$, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import { NotesSidebar } from "../components/Sidebar";
import { NoteEditor } from "../components/NoteEditor";
import { NoteList } from "../components/NoteList";
import { AuthBar } from "../components/AuthBar";
import styles from "./index.module.css?inline";

export type Note = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  updated_at: string;
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
}

type NoteStore = {
  notes: Note[];
  filteredNotes: Note[];
  selectedNoteId: string | null;
  search: string;
  tagFilter: string[];
  editing: boolean;
  authUser: User | null;
  loading: boolean;
  error: string | null;
};

export default component$(() => {
  useStylesScoped$(styles);

  // Notes state management
  const store = useStore<NoteStore>({
    notes: [],
    filteredNotes: [],
    selectedNoteId: null,
    search: "",
    tagFilter: [],
    editing: false,
    authUser: null,
    loading: true,
    error: null,
  });

  /** Fetch user and notes on mount */
  useTask$(async () => {
    try {
      store.loading = true;
      // Simulate authentication/session check and fetch
      const authRes = await fetch("/api/auth/me");
      if (authRes.ok) {
        store.authUser = await authRes.json();
        // Fetch notes
        const res = await fetch("/api/notes");
        if (res.ok) {
          const notesData = await res.json();
          store.notes = notesData;
          store.filteredNotes = notesData;
        } else {
          store.error = "Failed to load notes.";
        }
      } else {
        store.authUser = null;
      }
      store.loading = false;
    } catch (e) {
      store.error = "Failed to load notes.";
      store.loading = false;
    }
  });

  /** Filtering notes by search and tags */
  const handleFilter: QRL<(q?: string, tags?: string[]) => void> = $((q, tags) => {
    store.search = q ?? store.search;
    store.tagFilter = tags ?? store.tagFilter;
    let filtered = store.notes;
    if (store.search.trim()) {
      filtered = filtered.filter((n) =>
        n.title.toLowerCase().includes(store.search.toLowerCase()) ||
        n.body.toLowerCase().includes(store.search.toLowerCase())
      );
    }
    if (store.tagFilter.length) {
      filtered = filtered.filter((n) =>
        store.tagFilter.every((tag) => n.tags.includes(tag))
      );
    }
    store.filteredNotes = filtered;
  });

  const handleSelectNote = $((id: string) => {
    store.selectedNoteId = id;
    store.editing = false;
  });

  const handleEditNote = $((id: string) => {
    store.selectedNoteId = id;
    store.editing = true;
  });

  const handleAddNote = $(() => {
    store.selectedNoteId = null;
    store.editing = true;
  });

  // Refresh notes after update
  const refreshNotes = $(async () => {
    store.loading = true;
    const res = await fetch("/api/notes");
    if (res.ok) {
      store.notes = await res.json();
      handleFilter();
    }
    store.loading = false;
  });

  /** Authentication actions */
  const handleAuth = $(async (action: "login" | "logout") => {
    store.loading = true;
    if(action === "login") {
      // Example redirect to login (replace with real OAuth or provider)
      window.location.href = "/api/auth/login";
      return;
    } else if(action === "logout") {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.reload();
      return;
    }
    store.loading = false;
  });

  return (
    <div class="notes-app">
      <NotesSidebar
        notes={store.filteredNotes}
        tags={[...new Set(store.notes.flatMap((n) => n.tags))]}
        onFilterQrl={handleFilter}
        onSelectQrl={handleSelectNote}
        onEditQrl={handleEditNote}
        onAddQrl={handleAddNote}
        selectedNoteId={store.selectedNoteId}
        search={store.search}
        tagFilter={store.tagFilter}
        user={store.authUser}
        onAuthQrl={handleAuth}
      />
      <main class="main-area">
        <AuthBar user={store.authUser} onAuthQrl={handleAuth} />
        {store.loading && (
          <div class="loading-indicator">Loading...</div>
        )}
        {store.error && (
          <div class="error-message">{store.error}</div>
        )}
        {!store.loading && !store.editing && (
          <NoteList
            notes={store.filteredNotes}
            onSelectQrl={handleSelectNote}
            onEditQrl={handleEditNote}
            selectedNoteId={store.selectedNoteId}
          />
        )}
        {store.editing && (
          <NoteEditor
            note={store.selectedNoteId
              ? store.notes.find((n) => n.id === store.selectedNoteId) || null
              : null}
            onSaveQrl={refreshNotes}
            onCancelQrl={$(() => { store.editing = false; })}
          />
        )}
        {store.notes.length === 0 && !store.loading && (
          <div class="empty-state">No notes yet. Click "+" to add your first note.</div>
        )}
      </main>
    </div>
  );
});

// Qwik page head
export const head: DocumentHead = {
  title: "Personal Notes | Qwik",
  meta: [
    {
      name: "description",
      content: "Minimal and modern personal notes manager.",
    },
  ],
};
