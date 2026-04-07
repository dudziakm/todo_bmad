import { Router } from "express";

export function createTodoRouter(db) {
  const router = Router();

  const stmts = {
    getAll: db.prepare(
      "SELECT * FROM todos ORDER BY id DESC",
    ),
    getById: db.prepare("SELECT * FROM todos WHERE id = ?"),
    create: db.prepare(
      "INSERT INTO todos (title) VALUES (?) RETURNING *",
    ),
    update: db.prepare(`
      UPDATE todos
      SET title = COALESCE(?, title),
          completed = COALESCE(?, completed),
          updated_at = datetime('now')
      WHERE id = ?
      RETURNING *
    `),
    delete: db.prepare("DELETE FROM todos WHERE id = ?"),
  };

  function formatTodo(row) {
    return {
      id: row.id,
      title: row.title,
      completed: row.completed === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  router.get("/", (_req, res) => {
    const todos = stmts.getAll.all();
    res.json({ data: todos.map(formatTodo) });
  });

  router.post("/", (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Title is required",
        },
      });
      return;
    }

    const trimmed = title.trim();

    if (trimmed.length > 255) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Title must be 255 characters or less",
        },
      });
      return;
    }

    const todo = stmts.create.get(trimmed);
    res.status(201).json({ data: formatTodo(todo) });
  });

  router.patch("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid todo ID",
        },
      });
      return;
    }

    const existing = stmts.getById.get(id);
    if (!existing) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Todo not found" },
      });
      return;
    }

    const { title, completed } = req.body;

    let newTitle = null;
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Title must be a non-empty string",
          },
        });
        return;
      }
      newTitle = title.trim();
      if (newTitle.length > 255) {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Title must be 255 characters or less",
          },
        });
        return;
      }
    }

    let newCompleted = null;
    if (completed !== undefined) {
      if (typeof completed !== "boolean") {
        res.status(400).json({
          error: {
            code: "VALIDATION_ERROR",
            message: "Completed must be a boolean",
          },
        });
        return;
      }
      newCompleted = completed ? 1 : 0;
    }

    const updated = stmts.update.get(newTitle, newCompleted, id);
    res.json({ data: formatTodo(updated) });
  });

  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid todo ID",
        },
      });
      return;
    }

    const result = stmts.delete.run(id);
    if (result.changes === 0) {
      res.status(404).json({
        error: { code: "NOT_FOUND", message: "Todo not found" },
      });
      return;
    }

    res.status(204).end();
  });

  return router;
}
