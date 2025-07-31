import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

interface SidebarProps {
  notes: { id: string; title: string; tags: string[]; }[];
  tags: string[];
  onFilterQrl: PropFunction<(q: string, tags: string[]) => void>;
  onSelectQrl: PropFunction<(id: string) => void>;
  onAddQrl: PropFunction<() => void>;
  onEditQrl: PropFunction<(id: string) => void>;
  selectedNoteId: string | null;
  search: string;
  tagFilter: string[];
  user: { name: string; email: string } | null;
  onAuthQrl: PropFunction<(action: "login" | "logout") => void>;
}

export const NotesSidebar = component$((props: SidebarProps) => {
  return (
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2>Notes</h2>
        <button class="add-btn" aria-label="Add Note" onClick$={props.onAddQrl}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
            <rect x="8" y="3" width="2" height="12" fill="#333"/>
            <rect x="3" y="8" width="12" height="2" fill="#333"/>
          </svg>
        </button>
      </div>
      <input
        type="search"
        value={props.search}
        placeholder="Search notes..."
        onInput$={(e) =>
          props.onFilterQrl((e.target as HTMLInputElement).value, props.tagFilter)
        }
        class="sidebar-search"
      />
      <div class="sidebar-tags">
        {props.tags.map((tag) => (
          <button
            key={tag}
            class={{
              "tag-btn": true,
              selected: props.tagFilter.includes(tag)
            }}
            onClick$={() => {
              const current = props.tagFilter.includes(tag)
                ? props.tagFilter.filter((t) => t !== tag)
                : [...props.tagFilter, tag];
              props.onFilterQrl(props.search, current);
            }}
          >
            {tag}
          </button>
        ))}
      </div>
      <nav class="sidebar-notes">
        {props.notes.map((note) => (
          <div
            key={note.id}
            class={{
              "note-list-item": true,
              selected: props.selectedNoteId === note.id
            }}
            onClick$={() => props.onSelectQrl(note.id)}
          >
            <div class="note-title">{note.title || "<Untitled>"}</div>
            <div class="note-meta">
              {note.tags.length ? note.tags.map(tag => (
                <span key={tag} class="note-tag">{tag}</span>
              )) : null}
            </div>
          </div>
        ))}
      </nav>
      <footer class="sidebar-footer">
        {props.user ? (
          <div class="user-info">
            <span>{props.user.name}</span>
            <button class="auth-btn" onClick$={() => props.onAuthQrl("logout")}>Logout</button>
          </div>
        ) : (
          <button class="auth-btn" onClick$={() => props.onAuthQrl("login")}>Login</button>
        )}
      </footer>
    </aside>
  );
});
