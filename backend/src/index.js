import { createDatabase } from "./db/database.js";
import { createApp } from "./app.js";

const PORT = process.env.PORT || 3000;

const db = createDatabase();
const app = createApp(db);

const server = app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});

function shutdown() {
  console.log("Shutting down...");
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
