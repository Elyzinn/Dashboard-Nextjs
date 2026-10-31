import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { DatabaseSync, type SQLOutputValue } from "node:sqlite";

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

type StoredUser = User & { passwordHash: string };

const databasePath =
  process.env.SQLITE_DATABASE_PATH ??
  join(process.cwd(), "data", "dashboard.sqlite");

mkdirSync(dirname(databasePath), { recursive: true });

const globalForDatabase = globalThis as typeof globalThis & {
  dashboardDatabase?: DatabaseSync;
};

const database =
  globalForDatabase.dashboardDatabase ??
  new DatabaseSync(databasePath, { timeout: 5000 });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.dashboardDatabase = database;
}

database.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
`);

function toUser(row: Record<string, SQLOutputValue> | undefined): User | null {
  if (!row) return null;
  if (
    typeof row.id !== "number" ||
    typeof row.name !== "string" ||
    typeof row.email !== "string" ||
    typeof row.created_at !== "string"
  ) {
    throw new Error("O banco retornou um usuário com dados inválidos.");
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
  };
}

function toStoredUser(
  row: Record<string, SQLOutputValue> | undefined,
): StoredUser | null {
  const user = toUser(row);
  if (!user) return null;
  if (typeof row?.password_hash !== "string") {
    throw new Error("O banco retornou uma senha inválida.");
  }
  return { ...user, passwordHash: row.password_hash };
}

export function findUserByEmail(email: string): StoredUser | null {
  return toStoredUser(
    database
      .prepare(
        `SELECT id, name, email, password_hash, created_at
         FROM users WHERE email = ?`,
      )
      .get(email),
  );
}

export function createUser(
  name: string,
  email: string,
  passwordHash: string,
): number | null {
  const result = database
    .prepare(
      `INSERT OR IGNORE INTO users (name, email, password_hash)
       VALUES (?, ?, ?)`,
    )
    .run(name, email, passwordHash);

  return result.changes === 0 ? null : Number(result.lastInsertRowid);
}

export function listUsers(): User[] {
  return database
    .prepare(
      `SELECT id, name, email, created_at
       FROM users ORDER BY created_at DESC, id DESC`,
    )
    .all()
    .map((row) => {
      const user = toUser(row);
      if (!user) throw new Error("Não foi possível carregar a lista de usuários.");
      return user;
    });
}

export function getUserMetrics(): { total: number; newThisWeek: number } {
  const row = database
    .prepare(
      `SELECT
         COUNT(*) AS total,
         COUNT(CASE WHEN created_at >= datetime('now', '-7 days') THEN 1 END) AS new_this_week
       FROM users`,
    )
    .get();

  if (
    !row ||
    typeof row.total !== "number" ||
    typeof row.new_this_week !== "number"
  ) {
    throw new Error("Não foi possível carregar os indicadores do dashboard.");
  }

  return { total: row.total, newThisWeek: row.new_this_week };
}

export function createSession(
  tokenHash: string,
  userId: number,
  expiresAt: number,
): void {
  database.exec("DELETE FROM sessions WHERE expires_at <= unixepoch()");
  database
    .prepare(
      "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
    )
    .run(tokenHash, userId, expiresAt);
}

export function findUserBySession(tokenHash: string): User | null {
  return toUser(
    database
      .prepare(
        `SELECT users.id, users.name, users.email, users.created_at
         FROM sessions
         JOIN users ON users.id = sessions.user_id
         WHERE sessions.token_hash = ? AND sessions.expires_at > unixepoch()`,
      )
      .get(tokenHash),
  );
}

export function deleteSession(tokenHash: string): void {
  database.prepare("DELETE FROM sessions WHERE token_hash = ?").run(tokenHash);
}
