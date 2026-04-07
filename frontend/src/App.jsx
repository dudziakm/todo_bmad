import { useTodos } from "./hooks/useTodos.js";
import { TodoForm } from "./components/TodoForm.jsx";
import { TodoList } from "./components/TodoList.jsx";
import { EmptyState } from "./components/EmptyState.jsx";
import { ErrorBanner } from "./components/ErrorBanner.jsx";

export function App() {
  const {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    removeTodo,
    dismissError,
    retry,
  } = useTodos();

  return (
    <main className="app">
      <header className="app-header">
        <h1>Todos</h1>
      </header>

      <ErrorBanner message={error} onDismiss={dismissError} />

      <TodoForm onAdd={addTodo} />

      {loading ? (
        <div className="loading" role="status" aria-label="Loading todos">
          <span className="spinner" aria-hidden="true" />
          Loading...
        </div>
      ) : todos.length === 0 && !error ? (
        <EmptyState />
      ) : error && todos.length === 0 ? (
        <div className="error-state">
          <p>Could not load todos.</p>
          <button className="retry-button" onClick={retry}>
            Retry
          </button>
        </div>
      ) : (
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={removeTodo}
        />
      )}

      <footer className="app-footer">
        <span className="todo-count">
          {todos.filter((t) => !t.completed).length} item
          {todos.filter((t) => !t.completed).length === 1 ? "" : "s"}{" "}
          left
        </span>
      </footer>
    </main>
  );
}
