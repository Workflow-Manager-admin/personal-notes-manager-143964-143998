import { component$, useStore, $ } from "@builder.io/qwik";
import type { PropFunction } from "@builder.io/qwik";

type NoteData = {
  id?: string;
  title: string;
  body: string;
  tags: string[];
};

interface NoteEditorProps {
  note: NoteData | null;
  onSaveQrl: PropFunction<() => void>;
  onCancelQrl: PropFunction<() => void>;
}

export const NoteEditor = component$((props: NoteEditorProps) => {
  const noteState = useStore<NoteData>({
    id: props.note?.id,
    title: props.note?.title || "",
    body: props.note?.body || "",
    tags: props.note?.tags ? [...props.note.tags] : [],
  });

  const tagInput = useStore({ value: "" });
  const error = useStore<{ msg: string | null }>({ msg: null });

  /** Save or Update note */
  const handleSave = $(async () => {
    if (!noteState.title.trim()) {
      error.msg = "Title is required";
      return;
    }
    error.msg = null;
    const payload = {
      ...noteState,
      tags: noteState.tags.filter((t) => !!t.trim())
    };
    const url = noteState.id ? `/api/notes/${noteState.id}` : "/api/notes";
    const method = noteState.id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      props.onSaveQrl();
      props.onCancelQrl();
    } else {
      error.msg = "Could not save note!";
    }
  });

  /** Delete note */
  const handleDelete = $(async () => {
    if (!noteState.id) return;
    const res = await fetch(`/api/notes/${noteState.id}`, { method: "DELETE" });
    if (res.ok) {
      props.onSaveQrl();
      props.onCancelQrl();
    } else {
      error.msg = "Could not delete!";
    }
  });

  return (
    <div class="note-editor">
      <input
        class="editor-title"
        type="text"
        placeholder="Title"
        value={noteState.title}
        onInput$={(e) => (noteState.title = (e.target as HTMLInputElement).value)}
      />
      <textarea
        class="editor-body"
        rows={10}
        placeholder="Write your note here..."
        value={noteState.body}
        onInput$={(e) => (noteState.body = (e.target as HTMLTextAreaElement).value)}
      />
      <div class="editor-tags">
        {noteState.tags.map((t, i) => (
          <span key={i} class="tag">
            {t}
            <button onClick$={() => (noteState.tags = noteState.tags.filter((_, idx) => idx !== i))} aria-label="remove tag">×</button>
          </span>
        ))}
        <input
          type="text"
          class="tag-input"
          placeholder="+tag"
          value={tagInput.value}
          onInput$={(e) => (tagInput.value = (e.target as HTMLInputElement).value)}
          onKeyDown$={(e) => {
            if ((e as KeyboardEvent).key === "Enter" && tagInput.value.trim()) {
              noteState.tags = [...noteState.tags, tagInput.value.trim()];
              tagInput.value = "";
            }
          }}
        />
      </div>
      {error.msg && <div class="editor-error">{error.msg}</div>}
      <div class="editor-actions">
        <button class="save-btn" onClick$={handleSave}>
          {noteState.id ? "Update" : "Save"}
        </button>
        {noteState.id && (
          <button class="delete-btn" onClick$={handleDelete}>
            Delete
          </button>
        )}
        <button class="cancel-btn" onClick$={props.onCancelQrl}>Cancel</button>
      </div>
    </div>
  );
});
