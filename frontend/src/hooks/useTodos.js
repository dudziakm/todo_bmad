import { useState, useEffect, useCallback } from "react";
import * as api from "../api/todos.js";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function addTodo(title) {
    try {
      setError(null);
      const todo = await api.createTodo(title);
      setTodos((prev) => [todo, ...prev]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }

  async function toggleTodo(id) {
    const target = todos.find((t) => t.id === id);
    if (!target) return;

    const previous = [...todos];
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    );

    try {
      setError(null);
      await api.updateTodo(id, { completed: !target.completed });
    } catch (err) {
      setTodos(previous);
      setError(err.message);
    }
  }

  async function removeTodo(id) {
    const previous = [...todos];
    setTodos((prev) => prev.filter((t) => t.id !== id));

    try {
      setError(null);
      await api.deleteTodo(id);
    } catch (err) {
      setTodos(previous);
      setError(err.message);
    }
  }

  function dismissError() {
    setError(null);
  }

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    removeTodo,
    dismissError,
    retry: load,
  };
}
