import { TodoItem } from "./TodoItem.jsx";

export function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return null;
  }

  return (
    <ul className="todo-list" role="list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
