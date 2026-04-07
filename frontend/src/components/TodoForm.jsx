import { useState, useRef, useEffect } from "react";

export function TodoForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      await onAdd(trimmed);
      setTitle("");
      inputRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label htmlFor="todo-input" className="sr-only">
        New todo
      </label>
      <input
        ref={inputRef}
        id="todo-input"
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={255}
        disabled={submitting}
        aria-label="New todo"
      />
      <button
        type="submit"
        className="todo-submit"
        disabled={!title.trim() || submitting}
        aria-label="Add todo"
      >
        {submitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
