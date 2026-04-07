import Database from "better-sqlite3";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DEFAULT_DB_PATH = resolve(__dirname, "../../data/todos.db");

export function createDatabase(dbPath = DEFAULT_DB_PATH) {
  const dir = dirname(dbPath);
  mkdirSync(dir, { recursive: true });

  const db = new Database(dbPath);

  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  return db;
}

export function createTestDatabase() {
  return createDatabase(":memory:");
}
