const BASE_URL = "/api/todos";

export async function fetchTodos() {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error("Failed to fetch todos");
  }
  const body = await res.json();
  return body.data;
}

export async function createTodo(title) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error?.message || "Failed to create todo");
  }
  const body = await res.json();
  return body.data;
}

export async function updateTodo(id, updates) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.error?.message || "Failed to update todo");
  }
  const body = await res.json();
  return body.data;
}

export async function deleteTodo(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete todo");
  }
}
