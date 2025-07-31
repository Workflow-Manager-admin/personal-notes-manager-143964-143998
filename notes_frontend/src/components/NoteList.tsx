import { component$ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  updated_at: string;
}

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectQrl: PropFunction<(id: string) => void>;
  onEditQrl: PropFunction<(id: string) => void>;
}

export const NoteList = component$((props: NoteListProps) => {
  return (
    <div class="note-list">
      {props.notes.length === 0 ? (
        <div class="empty-note-list">No notes found.</div>
      ) : (
        <ul>
          {props.notes.map(note => (
            <li
              key={note.id}
              class={{
                "note-list-item": true,
                selected: props.selectedNoteId === note.id
              }}
              onClick$={() => props.onSelectQrl(note.id)}
            >
              <div class="note-list-title">{note.title || "<Untitled>"}</div>
              <div class="note-list-tags">
                {note.tags.map(tag => (
                  <span key={tag} class="note-tag">{tag}</span>
                ))}
              </div>
              <div class="note-list-meta">
                {note.updated_at && (
                  <time>{new Date(note.updated_at).toLocaleDateString()}</time>
                )}
                <button class="edit-btn" onClick$={(e) => { e.stopPropagation(); props.onEditQrl(note.id); }}>
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});
